import {NightwatchBrowser} from 'nightwatch';

const ADD_TASK_GLOBAL_SEL = 'add-task-bar.global input';
const ROUTER_WRAPPER = '.route-wrapper';

module.exports = {
  async command(this: NightwatchBrowser, taskName: string) {
    return this
      .waitForElementVisible(ROUTER_WRAPPER)
      .setValue('body', 'A')
      .waitForElementVisible(ADD_TASK_GLOBAL_SEL)
      .setValue(ADD_TASK_GLOBAL_SEL, taskName)
      .setValue(ADD_TASK_GLOBAL_SEL, this.Keys.ENTER)
      .setValue(ADD_TASK_GLOBAL_SEL, this.Keys.ESCAPE)
      // .waitForElementNotPresent(ADD_TASK_GLOBAL_SEL)
      ;
  }
};
