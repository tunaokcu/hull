//Doubly connected linked list

class Node{
    prev; next; contents;
    constructor(prev=null, next=null, contents=[]){
        this.prev = prev;
        this.next = next;
        this.contents = contents;
    }
}  

export default class DCLL{
    head;

    constructor(initArr=[]){
        this.initializeUsingArray(initArr);
    }

    //TODO handle iterator code
    iterator;
    startIteration(){
        this.iterator = this.head;
    }

    toArray(){
        let cur = this.head.next;

        let arr = [this.head.contents];

        while (cur != this.head){
            arr.push(cur.contents)

            cur = cur.next;
        }
        
        return arr;
    }

    initializeUsingArray(arr){
        this.head = null;

        if (arr == null || arr.length == 0){
            return; 
        }

        //Init first node and head
        let cur = new Node();
        cur.contents = arr[0];
        this.head = cur;
        let prev = cur; 

        for (let i = 1; i < arr.length; i++){
            cur = new Node();
            cur.contents = arr[i]

            prev.next = cur;
            cur.prev = prev;
            prev = cur;

        }

        cur.next = this.head;   
        this.head.prev = cur;
    
    }

    iterate(){
        let arr = [];

        if (this.head == null){
            return arr;
        }

        let cur = this.head;
        arr.push(cur.contents);
        cur = cur.next;

        while (cur != this.head){
            arr.push(cur.contents);
            cur = cur.next;
        }

        return arr;
    }
}


