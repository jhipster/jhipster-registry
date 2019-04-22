package io.github.jhipster.registry.web.rest.vm;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import io.github.jhipster.registry.utils.TestUtils;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;

import static org.assertj.core.api.Assertions.assertThat;

public class LoggerVMTest {

    @Test
    public void getNameTest() {
        LoggerVM vm = new LoggerVM();
        assertThat(vm.getName()).isNull();

        Logger logger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        vm = new LoggerVM(logger);
        assertThat(vm.getName()).isEqualTo(Logger.ROOT_LOGGER_NAME);
    }

    @Test
    public void setNameTest() {
        LoggerVM vm = new LoggerVM();
        vm.setName(null);
        assertThat(vm.getName()).isNull();

        vm = new LoggerVM();
        vm.setName("fakeName");
        assertThat(vm.getName()).isEqualTo("fakeName");

        Logger logger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        vm = new LoggerVM(logger);
        vm.setName("fakeRootName");
        assertThat(vm.getName()).isEqualTo("fakeRootName");
    }

    @Test
    public void getLevelTest() {
        LoggerVM vm = new LoggerVM();
        assertThat(vm.getLevel()).isNull();

        Logger logger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        vm = new LoggerVM(logger);
        assertThat(vm.getLevel()).isEqualTo(Level.ERROR.toString());
    }

    @Test
    public void setLevelTest() {
        LoggerVM vm = new LoggerVM();
        vm.setLevel(null);
        assertThat(vm.getLevel()).isNull();

        vm = new LoggerVM();
        vm.setLevel("fakeLevel");
        assertThat(vm.getLevel()).isEqualTo("fakeLevel");

        Logger logger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        vm = new LoggerVM(logger);
        vm.setLevel(Level.OFF.toString());
        assertThat(vm.getLevel()).isEqualTo(Level.OFF.toString());
    }

    @Test
    public void toStringTestTest() {
        Logger logger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        LoggerVM vm = new LoggerVM(logger);
        assertThat(vm.toString()).startsWith(LoggerVM.class.getSimpleName());
        String json = vm.toString().replace(LoggerVM.class.getSimpleName(), "");
        assertThat(TestUtils.isValid(json)).isTrue();
    }

}
