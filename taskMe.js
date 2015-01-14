function listModel(){
var tasks = [];
var id = "";

this.addTask = function(taskId){
	tasks.push(taskId);
}

this.setId = function(id1){
	id = id1;
}

this.getId = function(){
	return id;
}

}


function listView(){

this.showList = function(list){
	var listDiv = $(".listDiv").clone();
	listDiv.addClass('listStyle drop-enable');
	listDiv.attr('list-id',list.getId());
	listDiv.removeClass('listDiv');
	listDiv.find('.title').html(list.getId());
	this.bindEvent(listDiv,list);
	$("#main").append(listDiv);
	listDiv.droppable({
	accept:'.drag-enable',
	
	drop: function(){
		var content = privateVar.getContent();
		$(this).find('.tasksList').append(content.dom);
		list.addTask(content.task.getId());
		//code for updating task's parent
	}

	});
}

this.bindEvent = function(listDiv,list){
	listDiv.find('.create-task').off("click").on("click",function(){
	var taskName = prompt('Please enter task name');
		if(taskName){
			if(privateVar.getTaskList().indexOf(taskName.toUpperCase())>-1){
				alert('duplicate values not allowed!!');	
			}
			else{
				var task = new taskModel();
				task.setId(taskName);
				task.addParent(list.getId());
				list.addTask(taskName);
				taskView.showTask(task,listDiv);
			}
	  }
	});
	
	listDiv.find('.delete-list').off("click").on("click",function(){
	var listDeleteFlag = confirm('You want to delete this list??');
		if(listDeleteFlag){
			listDiv.remove();
			list = null;
		}
	});
}

}

function taskModel(){
var parent = "";
var id = "";
this.details={};

this.addParent = function(parentId){
	parent = parentId;
	this.details["parent"] = parentId;
}
this.setId = function(id1){
	id = id1;
	this.details["task-name"] = id1;
}

this.getId = function(){
	return id;
}
}

function taskView(){
	this.showTask = function(task,parent){
		var taskWrapper = $("<div></div>");
		taskWrapper.addClass("drag-enable");
		var removeTask = $("<span></span>");
		var modifyTask = $("<span></span>");
		removeTask.html("<img src='image/delete.png' width='15px' height='15px' title='Delete Task'>");
		modifyTask.html("<img src='image/edit.png' class='edit-task' width='15px' height='15px' title='Edit Task'>");
		removeTask.addClass("delete-task");
		modifyTask.addClass("modify-task");
		
		removeTask.off("click").on("click",function(){
			if(confirm('You want to remove this task??')){
				taskWrapper.remove();
				var taskList = privateVar.getTaskList();
				for(var i=0;i<taskList.length;i++){
					if(task.getId()==taskList[i]){
						taskList.splice(i,1);
					}
				}
				task=null;
			}
		});
		
		$(".tasksList").off("click").on("click",".edit-task",function(){
			if(confirm('You want to edit this task??')){
				taskBox.removeAttr('readonly');
				taskBox.focus();
				modifyTask.html("<img src='image/done.png' class='done-edit' width='15px' height='15px' title='Done'>");
			}
		});
		
		var taskBox = document.createElement("input");
		taskBox.type="text";
		taskBox.size="10";
		taskBox.className = "form-control";
		taskBox = $(taskBox);
		taskBox.attr('value',task.getId());
		taskBox.attr('readonly','readonly');
		taskWrapper.append(taskBox).append(modifyTask).append(removeTask);
		
		modifyTask.off("click").on("click",".done-edit",function(){
			taskBox.attr('readonly','readonly');
			task.setId(taskBox.attr('value'));
			modifyTask.html("<img src='image/edit.png' class='edit-task' width='15px' height='15px' title='Edit Task'>");
		});
		
		parent.find('.tasksList').append(taskWrapper);
		
		taskWrapper.draggable({
		containment:'document',
		revert:false,
		helper:'clone',

		drag: function(){
			privateVar.setContent({'dom':$(this),'task':task});
			//code for remove task from this list 
		}

		});

		privateVar.setTaskList(task.getId().toUpperCase());	
	}
}

function Controller(view){
 this.init = function(){
	$("#create-btn").off("click").on("click",function(){
		var list = new listModel();
		var listName = $("#list-name").val();
		if(privateVar.getListName().indexOf(listName.toUpperCase())>-1){
			alert('duplicate values not allowed!!');	
		}
		else{
			list.setId(listName);
			view.showList(list);
			privateVar.setListName(listName.toUpperCase());
			$("#list-name").val('');
		}
	});
 }
}

var listView  = new listView();
var taskView = new taskView();
var controller = new Controller(listView);
controller.init();

var privateVar = (function(){
	var content="",
		taskList=[],
		listNames=[];
	return {
		getContent: function(){
			return content;
		},
		setContent: function(value){
			content = value;
		},
		getTaskList: function(){
			return taskList;
		},
		setTaskList: function(taskName){
			taskList.push(taskName);
		},
		getListName: function(){
			return listNames;
		},
		setListName: function(listName){
			listNames.push(listName);
		}
	}
})();






