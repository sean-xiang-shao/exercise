;(function () {

    var app = angular.module("app", []);
    app.directive("stories", stories);
    
    function stories() {
        var storyDirective = {
            restrict: 'EAC',
            templateUrl: './templates/stories.directive.html',
            controller: StoryController,
            controllerAs: 'sc',
            bindToController: true
        };
    
        return storyDirective;
    } 
    
    function StoryController($http) {  
        var sc = this;
        sc.deleteStory = deleteStory;
        sc.search = search;
        sc.hitEnterKey = hitEnterKey;
        sc.clearSearch = clearSearch;
        sc.openAdd = openAdd;
        sc.addStory = addStory;
        sc.resetAdd = resetAdd;
        sc.cloneStory = cloneStory;
        sc.openUpdate = openUpdate;
        sc.cancelUpdate = cancelUpdate;
        sc.updateStory = updateStory;

        sc.showCheckBox = showCheckBox;
        sc.handleStoriesToCompare = handleStoriesToCompare;

        init();
      
        function init() {                      
            sc.stories = [];     // data

            sc.storiesDisplay = [];         // displayed data
            sc.recordsToBeCompared = [];    // data to compare

            sc.ind = -1;       // mark the record on focus
            sc.displayStories = true;
            sc.create = false;
            sc.edit = true;
            sc.showSelectTwo = false;
            sc.checkToSelect = false;
            sc.numOfChecked = 0;
            sc.compareTwo = false;

            // consume a simple PHP REST API to get the data
            $http.get("http://localhost/test/api/getStories.php")
            .then(function (response) {
                const storiesFromAPI = response.data.records;
                storiesFromAPI.forEach(s => {
                   let now = new Date();
                   let story = {
                       "name" : s.name,
                       "author" : s.author,
                       "keyWords" : s.keyWords,
                       "publisher" : s.publisher,
                       "lastUpdated" : now.toLocaleString()
                   };             
                   sc.stories.push(story);        
                   sc.storiesDisplay.push(story); 
                   sc.showSelectTwo = sc.storiesDisplay.length > 2 ? true : false;                   
                });
               })
            .catch(function (error) {
               console.error(error);
               sc.errorMessage = 'See console for the error. Please try again later.';
              });
        }
                 
        function findTheStory(targetName) {
            let i = 0;
            for (let s of sc.stories) {
                if (s.name === targetName) {
                    return i;
                }
                i++;
            }
        }

        function deleteStory(obj, ind) {
            sc.errorMessage = "";            
            
            // index of the data in displayed list could be different from that of the data list
            let targetStory = sc.storiesDisplay[ind];
            let indexOfTheStory = findTheStory(targetStory.name);

            sc.stories.splice(indexOfTheStory, 1);  // delete the record
            sc.storiesDisplay.splice(ind, 1);       // also delete it from display list

            sc.ind = (ind >= sc.ind ? sc.ind : --sc.ind);   
            sc.showSelectTwo = sc.storiesDisplay.length > 2 ? true : false; 
            if(sc.storiesDisplay.length <= 2) {
                sc.checkToSelect = false;
            }
            
            if (sc.storiesDisplay.length == 1) {
                if(sc.ind != -1) {
                    toggleUpdate(sc.ind);
                }
                sc.ind = -1;
                sc.edit = true;
            }            
        }

        function search() {
            sc.errorMessage = "";
            sc.displayStories = true;
            let searchText = document.getElementById('seachText').value.toLowerCase(); 
            sc.storiesDisplay = [];
            sc.stories.forEach(s => {
                if (s.name.toLowerCase().indexOf(searchText) !== -1 ||
                    s.author.toLowerCase().indexOf(searchText) !== -1 ||
                    s.keyWords.toLowerCase().indexOf(searchText) !== -1 ||
                    s.publisher.toLowerCase().indexOf(searchText) !== -1
                   ) {
                        sc.storiesDisplay.push(s); 
                }
            }); 
            if(sc.ind != -1) {
                toggleUpdate(sc.ind);
            }
            sc.ind = -1;
            sc.edit = true;   
            clearCheckboxes();    
            sc.showSelectTwo = sc.storiesDisplay.length > 2 ? true : false;    
        }

        function hitEnterKey(event) {  
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById("searchButton").click();
            }
        }

        function clearSearch() {
            sc.errorMessage = "";
            sc.displayStories = true;
            document.getElementById('seachText').value = "";
            sc.storiesDisplay = [];
            sc.stories.forEach(s => {
                sc.storiesDisplay.push(s); 
            });       
            if(sc.ind != -1) {
                toggleUpdate(sc.ind);
            }
            sc.ind = -1;
            sc.edit = true;    
            clearCheckboxes();
            sc.showSelectTwo = sc.storiesDisplay.length > 2 ? true : false;
        }

        function openAdd() {
            clearSearch();
            clearCheckboxes();
            resetAdd();
            sc.create = true;
            if(sc.ind != -1) {
                toggleUpdate(sc.ind);
            }
            sc.ind = -1;
            sc.edit = true;
            document.getElementById("newName").focus();
            // the above focus code seems not working with Firefox and Chrome; 
            // adding a setTimeout to make it work
            window.setTimeout( () => { document.getElementById('newName').focus(); }, 0);
        }

        function addStory() {
            clearSearch();
            let newName = document.getElementById("newName").value.replace(/^\s+|\s+$/g, '');
            if(newName === "") {
                sc.errorMessage = 'The recoomended online story needs a name.';
            } else {
                if (validateAgainstExistingStoryNames(newName)) {
                    let newAuthor = document.getElementById("newAuthor").value.replace(/^\s+|\s+$/g, '');
                    let newKeyWords = document.getElementById("newKeyWords").value.replace(/^\s+|\s+$/g, '');
                    let newPublisher = document.getElementById("newPublisher").value.replace(/^\s+|\s+$/g, '');
                    createNewStory(newName, newAuthor, newKeyWords, newPublisher);
                    document.getElementById("newName").value = "";
                    document.getElementById("newAuthor").value = "";
                    document.getElementById("newKeyWords").value = "";
                    document.getElementById("newPublisher").value = "";
                } else {
                    showExistingStoryWithTheSameName(newName);
                    document.getElementById("newName").focus();
                }   
            }  
        }

        function resetAdd() {
            clearSearch();
            clearAdd();        
        }

        function clearAdd() {
            document.getElementById('newName').value = ""; 
            document.getElementById('newAuthor').value = "";
            document.getElementById('newKeyWords').value = "";
            document.getElementById('newPublisher').value = "";
            document.getElementById("newName").focus();           
        }

        function cloneStory(obj) {
            sc.create = true;
            sc.errorMessage = "";
            if (sc.ind != -1) {
                toggleUpdate(sc.ind);
            }
            sc.ind = -1;
            sc.edit = true;
            document.getElementById("newName").value = obj.name;
            document.getElementById("newAuthor").value = obj.author;
            document.getElementById("newKeyWords").value = obj.keyWords;
            document.getElementById("newPublisher").value = obj.publisher;      
            // to guarantee the focus code to work, put it inside a setTimeout function
            window.setTimeout( () => { document.getElementById('newName').focus(); }, 0 );
        }

        function cancelUpdate(ind) {
            let id = "update_name_" + ind;
            document.getElementById(id).value = "";     
            id = "update_author_" + ind;
            document.getElementById(id).value = ""; 
            id = "update_keyWords_" + ind;
            document.getElementById(id).value = "";   
            id = "update_publisher_" + ind;
            document.getElementById(id).value = "";
            sc.edit = true;
            toggleUpdate(ind);
            sc.ind = -1;
            clearSearch();
        }

        function toggleUpdate(ind) {
            let id = "name_" + ind;
            toggleShowAndHide(id);
            id = "update_name_" + ind;
            toggleShowAndHide(id);     
            id = "author_" + ind;
            toggleShowAndHide(id);   
            id = "update_author_" + ind;
            toggleShowAndHide(id);   
            id = "keyWords_" + ind;
            toggleShowAndHide(id);   
            id = "update_keyWords_" + ind;
            toggleShowAndHide(id);   
            id = "publisher_" + ind;
            toggleShowAndHide(id);   
            id = "update_publisher_" + ind;
            toggleShowAndHide(id);   
            id = "lastUpdated_" + ind;
            toggleShowAndHide(id); 
            id = "update_" + ind;
            toggleShowAndHide(id); 
            id = "cancel_" + ind;
            toggleShowAndHide(id);
            id = "delete_" + ind;
            toggleShowAndHide(id); 
            id = "edit_" + ind;
            toggleShowAndHide(id); 
            id = "copy_" + ind;
            toggleShowAndHide(id);
        }

        function toggleShowAndHide(id) {
            let element = document.getElementById(id);
            let className_arr = element.className.split(" ");
            if (className_arr.indexOf("hidden") == -1) {
              element.className = element.className.replace(/show/, 'hidden');
            } else if (className_arr.indexOf("show") == -1) {
                element.className = element.className.replace(/hidden/, 'show');
            }
        }   

        function openUpdate(obj, ind) {
            sc.errorMessage = "";
            let id = "update_name_" + ind;
            document.getElementById(id).value = obj.name;     
            id = "update_author_" + ind;
            document.getElementById(id).value = obj.author; 
            id = "update_keyWords_" + ind;
            document.getElementById(id).value = obj.keyWords;  
            id = "update_publisher_" + ind;
            document.getElementById(id).value = obj.publisher;
            sc.edit = false;
            toggleUpdate(ind);
            sc.ind = findTheStory(obj.name);   
            sc.create = false;
        }

        function updateStory(obj, ind) {
            sc.errorMessage = "";
            let name_id = "update_name_" + ind;
            let newName = document.getElementById(name_id).value.replace(/^\s+|\s+$/g, '');
            if(newName === "") {
                sc.errorMessage = 'The recoomended online story needs a name.';
                document.getElementById(name_id).focus(); 
            } else {
                if(sc.ind >= 0) {  
                    let s = sc.stories[sc.ind];

                    let author_id = "update_author_" + ind;
                    let newAuthor = document.getElementById(author_id).value.replace(/^\s+|\s+$/g, '');
                    let keyWords_id = "update_keyWords_" + ind;
                    let newKeyWords = document.getElementById(keyWords_id).value.replace(/^\s+|\s+$/g, '');
                    let publisher_id = "update_publisher_" + ind;
                    let newPublisher = document.getElementById(publisher_id).value.replace(/^\s+|\s+$/g, '');
    
                    if (s.name === newName && s.author === newAuthor && s.keyWords === newKeyWords && s.publisher === newPublisher) {
                        sc.errorMessage = 'No change for the story. Retry.';
                        document.getElementById(name_id).focus(); 
                    } else {                  
                        s.name = newName;
                        s.author = newAuthor;
                        s.keyWords = newKeyWords;              
                        s.publisher = newPublisher;
                        let now = new Date();
                        s.lastUpdated = now.toLocaleString();
    
                        toggleUpdate(ind);
                        sc.edit = true;
                        sc.ind = -1;
                    }  
                } else {
                    sc.errorMessage = 'The index of the record on focus got messed up.';
                }
                 
            }
        }

        function validateAgainstExistingStoryNames(entered_name) { 
            for (let s of sc.stories) { 
                if(s.name.toLowerCase() === entered_name.toLowerCase()) {
                    return false;
                }
            }
            return true;
        }

        function showExistingStoryWithTheSameName(enteredName) {
            document.getElementById("seachText").value = enteredName;
            sc.storiesDisplay = [];
            for (let s of sc.stories) {
                if(s.name.toLowerCase() === enteredName.toLowerCase()) {
                    sc.storiesDisplay.push(s); 
                    break;
                }
            }
            sc.errorMessage = 'There has alredy been an online story with the same name.';
        }

        function createNewStory(name, author, keyWords, publisher) {
            let now = new Date();
            let newStory = {
                "name" : name,
                "author" : author,
                "keyWords" : keyWords,
                "publisher" : publisher,
                "lastUpdated" : now.toLocaleString()
            };
            sc.stories.push(newStory);
            sc.storiesDisplay.push(newStory);
            sc.showSelectTwo = sc.storiesDisplay.length > 2 ? true : false; 
        }

        function showCheckBox() {
            clearSearch();
            sc.numOfChecked = 0;
            sc.checkToSelect = true;
            sc.create = false;
        }

        function clearCheckboxes() {
            sc.numOfChecked = 0;
            sc.compareTwo = false;
            let allInputs = document.getElementsByTagName('input');
            for(let i = 0; i < allInputs.length; i++) {
              if(allInputs[i].type == 'checkbox') {
                allInputs[i].checked = false;
              }
            }
        }

        function handleStoriesToCompare(obj, ind) {
            let id = "checkbox_" + ind;
            let checked = document.getElementById(id).checked;
            sc.numOfChecked = checked ? ++sc.numOfChecked : --sc.numOfChecked;
            sc.checkToSelect = sc.numOfChecked < 2 ? true : false;

            if(checked) {
                sc.recordsToBeCompared[sc.numOfChecked - 1] = obj;
            } else {
                sc.recordsToBeCompared.pop();
            }

            if (sc.numOfChecked == 2) {
                sc.compareTwo = true;
                sc.displayStories = false;
                sc.create = false;

                let story1 = sc.recordsToBeCompared[0];
                let story2 = sc.recordsToBeCompared[1];

                if(story2.author !== story1.author) {
                    changeBgcolor("compare_author_0");
                }
                if(story2.keyWords !== story1.keyWords) {
                    changeBgcolor("compare_kw_0");
                }
                if(story2.publisher !== story1.publisher) {
                    changeBgcolor("compare_publisher_0");
                }

            }

        }

        function changeBgcolor(id) {
            let element = document.getElementById(id);
            element.className = element.className.replace(/greenbkgd/, 'bluebkgd');
        }
    
    }
    
}());
    