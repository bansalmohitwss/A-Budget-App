 var budgetController = (function(){
    
     // Function Constructor 
     var Expense = function(id,description,value){
         this.id = id;
         this.description = description;
         this.value = value;
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
        percentageLabel: '.budget__expenses--percentage'
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
                
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                
            } else if(type === 'exp'){
                element = DOMStrings.expenseContainer;
                
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix">    <div class="item__value">%value%</div><div class="item__percentage">21%</div>   <div class="item__delete">       <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>   </div> </div></div>';
            }
            
            html = html.replace('%id%',item.id);
            html = html.replace('%description%',item.description);
            html = html.replace('%value%',item.value);
            
            document.querySelector(element).insertAdjacentHTML('beforeend',html);
            
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
        
    };
    
    
    var updateBudget = function(){
      
        // Calculate Budget 
        budgetCtrl.calculateBudget();
        
        // Return Budget , needed to display to ui
        var budget = budgetCtrl.getBudget();
        
        // show on ui
        
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
        }
    }
    
    
    // Return Init Fucntion to call setupEventListeners Method
    
    return {
        init: function(){
            console.log('Application has started!');
            setupEventListeners();
        }
    };
    
})(budgetController,uiController);

Controller.init();
