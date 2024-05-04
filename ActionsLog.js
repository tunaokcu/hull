export default class ActionsLog{
    
    //Init with HTML ID
    constructor(id){
        this.id = id;
        this.actionsLog = document.getElementById(id);
    }

    addAction(message){
        const newAction = document.createElement("li");
        newAction.textContent = message;

        this.actionsLog.appendChild(newAction);

        // Scroll to the bottom after adding a new action
        this.actionsLog.scrollTop = this.actionsLog.scrollHeight;
    }

    clearLog(){
        this.actionsLog.innerHTML = '';
    }
}