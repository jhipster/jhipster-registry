package io.github.jhipster.registry.web.rest.vm;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import io.github.jhipster.registry.utils.TestUtils;
import org.junit.Test;
import org.slf4j.LoggerFactory;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class LoggerVMTest {

    @Test
    public void getNameTest() throws Exception {
        LoggerVM vm = new LoggerVM();
        assertNull(vm.getName());

        Logger logger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        vm = new LoggerVM(logger);
        assertEquals(Logger.ROOT_LOGGER_NAME, vm.getName());
    }

    @Test
    public void setNameTest() throws Exception {
        LoggerVM vm = new LoggerVM();
        vm.setName(null);
        assertNull(vm.getName());

        vm = new LoggerVM();
        vm.setName("fakeName");
        assertEquals("fakeName", vm.getName());

        Logger logger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        vm = new LoggerVM(logger);
        vm.setName("fakeRootName");
        assertEquals("fakeRootName", vm.getName());
    }

    @Test
    public void getLevelTest() throws Exception {
        LoggerVM vm = new LoggerVM();
        assertNull(vm.getLevel());

        Logger logger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        vm = new LoggerVM(logger);
        assertEquals(Level.ERROR.toString(), vm.getLevel());
    }

    @Test
    public void setLevelTest() throws Exception {
        LoggerVM vm = new LoggerVM();
        vm.setLevel(null);
        assertNull(vm.getLevel());

        vm = new LoggerVM();
        vm.setLevel("fakeLevel");
        assertEquals("fakeLevel", vm.getLevel());

        Logger logger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        vm = new LoggerVM(logger);
        vm.setLevel(Level.OFF.toString());
        assertEquals(Level.OFF.toString(), vm.getLevel());
    }

    @Test
    public void toStringTestTest() throws Exception {
        Logger logger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        LoggerVM vm = new LoggerVM(logger);
        assertTrue(vm.toString().startsWith(LoggerVM.class.getSimpleName()));
        String json = vm.toString().replace(LoggerVM.class.getSimpleName(), "");
        assertTrue(TestUtils.isValid(json));
    }

}
