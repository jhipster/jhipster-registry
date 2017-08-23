package io.github.jhipster.registry.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.refresh.ContextRefresher;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.stream.Collectors;

import static com.sun.nio.file.SensitivityWatchEventModifier.HIGH;
import static io.github.jhipster.config.JHipsterConstants.SPRING_PROFILE_K8S;
import static java.nio.file.FileVisitOption.FOLLOW_LINKS;
import static java.nio.file.FileVisitResult.CONTINUE;
import static java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY;

/**
 * Kubernetes (K8s) cloud config refresher service
 */
@Service
@Profile(SPRING_PROFILE_K8S)
public class CloudConfigRefreshService {

    private final Logger log = LoggerFactory.getLogger(CloudConfigRefreshService.class);

    private final ContextRefresher refresher;

    private final String configPath;

    private ScheduledExecutorService taskExecutor;

    /**
     * Constructor
     *
     * @param refresher  ContextRefresher
     * @param configPath String
     */
    public CloudConfigRefreshService(ContextRefresher refresher, @Value("${k8s.config.path}") String configPath) {
        this.refresher = refresher;
        this.configPath = configPath;
    }

    /**
     * Creates a daemon thread when {@link #getConfigPath configPath} is specified through the environment
     * variable {@code k8s.config.path}. Daemon thread will execute the watcher service asynchronously.
     */
    @PostConstruct
    public void configMapWatcher() {
        if (getConfigPath() != null && !getConfigPath().isEmpty()) {
            taskExecutor = Executors.newSingleThreadScheduledExecutor(
                job -> {
                    Thread thread = new Thread(job, "CloudConfigMapRefresher");
                    thread.setDaemon(true);
                    return thread;
                }
            );
            taskExecutor.execute(() -> {
                try {
                    configMapRefreshContext();
                } catch (IOException | InterruptedException ex) {
                    log.error("Unable to refresh K8s ConfigMap", ex);
                }
            });
        } else {
            log.error("ConfigMap directory path not specified. Specify value for the environment variable k8s.config.path");
        }
    }

    /**
     * {@code WatchService} object to monitor K8s configMap path. Mounted configMap path will be recursively
     * registered with the {@code WatchService} instance to get notified for interested events.
     *
     * @throws IOException
     * @throws InterruptedException
     */
    public void configMapRefreshContext() throws IOException, InterruptedException {
        List<File> fileList = new ArrayList();
        List<Integer> hashList = new ArrayList();
        WatchService watcherService = FileSystems.getDefault().newWatchService();
        Path dirPath = Paths.get(getConfigPath());
        Files.walkFileTree(dirPath, new HashSet<FileVisitOption>() {
            {
                add(FOLLOW_LINKS);
            }
        }, 2, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException {
                log.debug("Registering" + dir + " in watcher service");
                dir.register(watcherService, new WatchEvent.Kind[]{ENTRY_MODIFY}, HIGH);
                return CONTINUE;
            }

            @Override
            public FileVisitResult visitFile(Path path, BasicFileAttributes attrs) throws IOException {
                File file = path.toFile();
                if (isValidConfigFile(file.getName().toLowerCase())) {
                    log.debug("Adding file: " + file.getAbsolutePath());
                    fileList.add(file);
                    hashList.add(getHashValue(file));
                }
                return CONTINUE;
            }
        });
        while (true) {
            WatchKey key = watcherService.take();
            List<WatchEvent<?>> events = key.pollEvents();
            if (!events.isEmpty()) {
                if (log.isDebugEnabled()) {
                    events.forEach(event -> log.debug("Event detected: " + event.kind().name() + ", Updated File: " + event.context()));
                }
                Collection<Integer> activeList = fileList.stream().map(entry -> getHashValue(entry)).collect(Collectors.toList());
                if (!hashList.containsAll(activeList)) {
                    log.debug("File system updated. Hashed content matching failed");
                    hashList.clear();
                    hashList.addAll(activeList);
                    refresher.refresh();
                    log.debug("@Refreshscope context refreshed for ConfigMap update");
                } else {
                    // do nothing
                    log.debug("Hashed content unchanged. Ignore and continue");
                }
                if (!key.reset()) {
                    log.error("Unable to reset the watcher service. Try restarting the running instance");
                    break;
                }
            } else {
                // do nothing
                log.debug("Event list is empty. Ignore and continue.");
            }
        }
    }

    @PreDestroy
    public void destroy() {
        if (taskExecutor != null) {
            taskExecutor.shutdown();
        }
    }

    /**
     * Generates hash value
     * @param file File
     * @return hasCode int
     */
    private int getHashValue(File file) {
        return (37 * 21 + (file.getAbsolutePath().hashCode() + (int) (file.length() ^ (file.length() >>> 32))
            + (int) (file.lastModified() ^ (file.lastModified() >>> 32))));
    }

    /**
     * Checks for valid file extension
     *
     * @param name String - file name
     * @return boolean
     */
    private boolean isValidConfigFile(String name) {
        return name.endsWith(".yml") || name.endsWith(".yaml") || name.endsWith(".properties");
    }

    /**
     * Returns config path
     *
     * @return configPath String
     */
    public String getConfigPath() {
        return configPath;
    }
}
