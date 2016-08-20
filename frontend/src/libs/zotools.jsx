/**
 * @author  reetsee.com
 * @date    20160820
 * @desc    01库工具
 */
export class Q {
    constructor() {
        this.index = 0;
        this.queue = [[], []];
    }

    push(e) {
        this.queue[this.index].push(e);
    }

    pop() {
        this.queue[this.index].pop(e);
    }

    empty() {
        return this.queue[this.index].length == 0;
    }

    getIns(notCur) {
        let index = notCur ? (this.index ^ 1) : this.index;
        return this.queue[index];
    }

    getCopy(notCur) {
        let index = notCur ? (this.index ^ 1) : this.index;
        return Ojbect.assign([], this.queue[index]);
    }
    
    swap() {
        this.index = this.index ^ 1;
    }

    clear(notCur) {
        let index = notCur ? (this.index ^ 1) : this.index;
        this.queue[index] = [];
    }
}
