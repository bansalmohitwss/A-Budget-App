 var budgetController = (function(){
    
     // Function Constructor 
     var Expense = function(id,description,value){
         this.id = id;
         this.description = description;
         this.value = value;
         this.percentage = -1;
     };
     
     
     
     var Income = function(id,description,value){
         this.id = id;
         this.description = description;
         this.value = value;
     };
     
     var calculateSum = function(type){
         var sum = 0;
         
         data.allItems[type].forEach(function(curr){
            
             sum += curr.value;
         });
         
         data.totals[type] = sum;
         
     }
     // want to keep data organised, Create a large data
     
     var data = {
         allItems: {
             exp: [],
             inc: []
         },
         totals: {
             exp: 0,
             inc: 0
         },
         budget: 0,
         percentage: 0
     };
     
     return {
         addItem: function(type,desc,value){
             var newItem, Id;
             
             // Create New id which will be last_id+1
             if(data.allItems[type].length === 0){
                 Id=0;
             } else {
                 Id = data.allItems[type][data.allItems[type].length-1].id+1;
             }
             
             
             if(type === 'inc'){
                 newItem = new Income(Id,desc,value);
             } else if(type === 'exp') {
                 newItem = new Expense(Id,desc,value);
             }
             
             // Add element to data structure
             data.allItems[type].push(newItem);
             
             return newItem;
         },
        
         deleteItem: function(type,ID){
              var ids,index;
             
             ids = data.allItems[type].map(function(current){
                 return current.id;
             });
             
             index = ids.indexOf(ID);
             
             if( index !== -1){
                 data.allItems[type].splice(index,1);
             }
             
             // Mapping of ids with index number
         },
         
         testing: function(){
             console.log(data);
         },
         
         calculateBudget: function(){
             
             //calculate sum of expenses and incomes
             calculateSum('inc');
             calculateSum('exp');
             
             // Update Budget
             data.budget = data.totals.inc - data.totals.exp;
             
             // calculate percentage
             if(data.totals.inc > 0){
                 data.percentage = Math.round(( data.totals.exp / data.totals.inc )*100 );
             } else {
                 data.percentage = -1;
             }
             
         },
         
         calculatePercentage: function(){
           
             data.allItems.exp.forEach(function(curr){
                
                 if(data.totals.inc > 0){
                      curr.percentage = Math.round( ( curr.value / data.totals.inc ) *100 );
                 } else {
                     curr.percentage = -1;
                 }
             });
             
         },
         
         getPercentage: function(){
         
             var percentages = data.allItems.exp.map(function(curr){
                
                 return curr.percentage;
             });
           
             return percentages;
         },
         
         getBudget: function(){
             
             return {
                 budget: data.budget,
                 percentage: data.percentage,
                 totalIncome: data.totals.inc,
                 totalExpense: data.totals.exp
             };
         }
     };
     
})();



var uiController = (function(){
    
    // Create Object for all classes used in ui
    
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    var formatNumber = function(num, type){
        var numSplit, int;
        
        num = Math.abs(num);
        // toFixed() Returns String , and it is prototype function called on num, it automatically converted to object.
        num = num.toFixed(2);
        
        numSplit = num.split('.');
        int = numSplit[0];
        
        if(int.length > 3){
            int = int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
        }
        
        return (type==='exp'? '-' : '+')+ int +'.' + numSplit[1];
    };
    
    // Creating foreach method for nodeList
    
    var nodeListForEach = function(list, forEach){
                
        for(var i=0; i<list.length; i++){
            forEach(list[i],i);
        }
    };
    
    return {
        getInput: function(){
            
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        getDOMStrings: function(){
            return DOMStrings;
        },
        
        addListItem: function(item, type){
            var html,element;
            
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            } else if(type === 'exp'){
                element = DOMStrings.expenseContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix">    <div class="item__value">%value%</div><div class="item__percentage">21%</div>   <div class="item__delete">       <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>   </div> </div></div>';
            }
            
            html = html.replace('%id%',item.id);
            html = html.replace('%description%',item.description);
            html = html.replace('%value%',formatNumber(item.value, type));
            
            document.querySelector(element).insertAdjacentHTML('beforeend',html);
            
        },
        
        deleteListItem: function(ID){
        
            // we can't delete an item directly, we can remove using it's parent only.
            var el = document.getElementById(ID);
            el.parentNode.removeChild(el);
        },
        
        clearFields: function(){
            var fields, newFields;
            
            // Returns List , Not array 
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            
            // Convert List to Array
            newFields = Array.prototype.slice.call(fields);
            
            // Accept three Arguments 1. current field 2. index of that field 3. whole array
            newFields.forEach(function(curr, ind, array){
                curr.value="";
            });
            
            // Set focus to first input field that's description
            newFields[0].focus();
        },
        
        displayBudget: function(input){
            var type;        
            type = input.budget>0 ? 'inc' : 'exp';
            
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(input.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(input.totalIncome, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(input.totalExpense, 'exp');
            
            if(input.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = input.percentage+'%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
            
        },
        
        displayPercentage: function(percentages){
            
            // It returns a nodeList
            
            var fields = document.querySelectorAll(DOMStrings.expensePercentageLabel);
            
            nodeListForEach(fields, function(curr, index){
                
                if( percentages[index] > 0){
                    curr.textContent = percentages[index] + '%';
                } else {
                    curr.textContent = '---';
                }
            });
            
        },
        
        displayDate: function(){
            var now,months;
            
            now = new Date();
            months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            
            document.querySelector(DOMStrings.dateLabel).textContent = months[now.getMonth()] + ' ' + now.getFullYear();
        },
        
        changedType: function(){
            
            var fields = document.querySelectorAll(DOMStrings.inputType+','+DOMStrings.inputDescription+','+DOMStrings.inputValue);
            
            nodeListForEach(fields, function(curr, index){
               
                curr.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMStrings.inputButton).classList.toggle('red');
        }
    };
    
    
})();



var Controller = (function(budgetCtrl,uiCtrl){
    
    
    // Add method for all event listeners and variables
    
    var setupEventListeners = function(){
      
        var domStrings = uiCtrl.getDOMStrings();
        
        document.querySelector(domStrings.inputButton).addEventListener('click',CtrladdItem);
        document.addEventListener('keypress',function(event){
       
            if(event.keyCode === 13 || event.which === 13)
                CtrladdItem();
        });
        
        document.querySelector(domStrings.container).addEventListener('click',CtrldeleteItem);
        document.querySelector(domStrings.inputType).addEventListener('change',uiCtrl.changedType);
        
    };
    
    
    var updatePercentage = function(){
        var percentages;
        
        // calculate percentages 
        budgetCtrl.calculatePercentage();
        
        // get percentages 
        percentages = budgetCtrl.getPercentage();
        
        // display percentage on user interface
        uiCtrl.displayPercentage(percentages);
    };
    
    
    var updateBudget = function(){
      
        // Calculate Budget 
        budgetCtrl.calculateBudget();
        
        // Return Budget , needed to display to ui
        var budget = budgetCtrl.getBudget();
        
        // show on ui
        uiCtrl.displayBudget(budget);
    };
    
    
    var CtrladdItem = function(){
        var input,newItem;
        
        // Fetch Input from UI Controller
        input = uiCtrl.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            
            // add input to data structure
            newItem = budgetCtrl.addItem(input.type,input.description,input.value);
        
            // add new Item to User Interface
            uiCtrl.addListItem(newItem,input.type);
        
            //Clear Fields
            uiCtrl.clearFields();
            
            updateBudget();
            
            updatePercentage();
        }
    }
    
    
    var CtrldeleteItem = function(event){
        var itemID, splitString, ID, type;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
              
        if(itemID){
            splitString = itemID.split('-');
            ID = parseInt(splitString[1]);
            type = splitString[0];
            
            // Delete item from data structure
             budgetCtrl.deleteItem(type, ID);
            
            // Delete item for user inetface
            uiCtrl.deleteListItem(itemID);
            
            // update user interface
            updateBudget();
            
            // update percentage
            updatePercentage();
        }
        
    };
    
    // Return Init Fucntion to call setupEventListeners Method
    
    return {
        init: function(){
            console.log('Application has started!');
            uiCtrl.displayDate();
            uiCtrl.displayBudget({
                
                budget: 0,
                percentage: -1,
                totalIncome: 0,
                totalExpense: 0
                
            });
            
            setupEventListeners();
        }
    };
    
})(budgetController,uiController);

Controller.init();
