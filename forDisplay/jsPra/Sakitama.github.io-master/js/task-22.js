window.onload = function () {
    (function (window, undefined) {
        /*var BinaryTree = {
            root: {
                value: "A",
                leftTree: {
                    value: "B",
                    leftTree: {
                        value: "D",
                        leftTree: {
                            value: "H",
                            leftTree: null,
                            rightTree: null
                        },
                        rightTree: {
                            value: "I",
                            leftTree: null,
                            rightTree: null
                        }
                    },
                    rightTree: {
                        value: "E",
                        leftTree: {
                            value: "J",
                            leftTree: null,
                            rightTree: null
                        },
                        rightTree: {
                            value: "K",
                            leftTree: null,
                            rightTree: null
                        }
                    }
                },
                rightTree: {
                    value: "C",
                    leftTree: {
                        value: "F",
                        leftTree: {
                            value: "L",
                            leftTree: null,
                            rightTree: null
                        },
                        rightTree: {
                            value: "M",
                            leftTree: null,
                            rightTree: null
                        }
                    },
                    rightTree: {
                        value: "G",
                        leftTree: {
                            value: "N",
                            leftTree: null,
                            rightTree: null
                        },
                        rightTree: {
                            value: "O",
                            leftTree: null,
                            rightTree: null
                        }
                    }
                }
            }
        };*/
        var traversalResult = [];
        var root = document.getElementsByClassName("one")[0];
        var timer = null;
        var head = null;
        var preOrder = $("preOrder");
        var inOrder = $("inOrder");
        var postOrder = $("postOrder");
        var BFS = $("BFS");
        var choose = $("choose");
        /*
        添加事件
         */
        function $(id) {
            return document.getElementById(id);
        }
        $.addEvent = function (element, event, listener) {
            if (element.addEventListener) { //标准
                element.addEventListener(event, listener, false);
            } else if (element.attachEvent) { //低版本ie
                element.attachEvent("on" + event, listener);
            } else { //都不行的情况
                element["on" + event] = listener;
            }
        };
        $.delegateEvent = function (element, tag, eventName, listener) {
            $.addEvent(element, eventName, function () {
                var event = arguments[0] || window.event,
                    target = event.target || event.srcElement;
                if (target && target.tagName === tag.toUpperCase()) {
                    listener.call(target, event);
                }
            });
        };
        /*
        停止当前遍历，开始新的遍历
         */
        function reset() {
            if (traversalResult.length > 0) { //如果队列非空即正在遍历
                head.style.backgroundColor = "#fff";//清除残留蓝色
                traversalResult = []; //清空队列
                clearTimeout(timer); //清除定时器
            }
        }
        /*
        先序、中序、后序和层次遍历
         */
        function getPreOrderResult(node) {
            reset();
            (function preOrder(node) {
                if(node !== null) {
                    traversalResult.push(node);
                    preOrder(node.firstElementChild);
                    preOrder(node.lastElementChild);
                }
            })(node);
            show();
        }
        function getInOrderResult(node) {
            reset();
            (function inOrder(node) {
                if(node !== null) {
                    inOrder(node.firstElementChild);
                    traversalResult.push(node);
                    inOrder(node.lastElementChild);
                }
            })(node);
            show();
        }
        function getPostOrderResult(node) {
            reset();
            (function postOrder(node) {
                if(node !== null) {
                    postOrder(node.firstElementChild);
                    postOrder(node.lastElementChild);
                    traversalResult.push(node);
                }
            })(node);
            show();
        }
        function BFSResult(node) {
            reset();
            (function BFS(node) {
                var queue = [];
                var p = null;
                if(node !== null) {
                    queue.push(node);
                }
                while (queue.length > 0) {
                    p = queue.shift();
                    traversalResult.push(p);
                    if (p.firstElementChild !== null) {
                        queue.push(p.firstElementChild);
                    }
                    if (p.lastElementChild !== null) {
                        queue.push(p.lastElementChild);
                    }
                }
            })(node);
            show();
        }
        /*
        显示
         */
        function show() {
            head = traversalResult.shift(); //出队
            if (head) {
                head.style.backgroundColor = "#6fa3ff";//显示蓝色
                timer = setTimeout(function () {
                    head.style.backgroundColor = "#fff";//1秒后节点的蓝色变为白色
                    show(); //递归调用show，使要显示的节点不停出队显示，直至为空
                }, 1000);
            }
        }
        /*
        程序入口
         */
        $.delegateEvent(choose, "button", "click", startTraversal);
        function startTraversal() {
            if (this.id === "preOrder") {
                getPreOrderResult(root);
            } else if (this.id === "inOrder") {
                getInOrderResult(root);
            } else if (this.id === "postOrder"){
                getPostOrderResult(root);
            } else {
                BFSResult(root)
            }
        }
    })(window);
};