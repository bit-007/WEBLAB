// Stack Module
const StackModule = (function() {
    let items = [];
    
    return {
        push: function(element) { items.push(element); },
        pop: function() { return items.length > 0 ? items.pop() : null; },
        peek: function() { return items.length > 0 ? items[items.length - 1] : null; },
        isEmpty: function() { return items.length === 0; },
        size: function() { return items.length; }
    };
})();

// Queue Module  
const QueueModule = (function() {
    let items = [];
    
    return {
        enqueue: function(element) { items.push(element); },
        dequeue: function() { return items.length > 0 ? items.shift() : null; },
        front: function() { return items.length > 0 ? items[0] : null; },
        isEmpty: function() { return items.length === 0; },
        size: function() { return items.length; }
    };
})();

// Usage:
StackModule.push(10);
StackModule.push(20);
console.log(StackModule.pop()); // 20

QueueModule.enqueue("A");
QueueModule.enqueue("B"); 
console.log(QueueModule.dequeue()); // "A"

