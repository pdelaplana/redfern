function BoardSidebar(boardUI) {

    var boardUI = boardUI,
        self = this;

    self.activeOption = ko.observable('main');
    self.boardId = boardUI.boardId;
    self.name = boardUI.name;
    self.owner = boardUI.owner;
    self.ownerFullName = boardUI.ownerFullName;
    self.viewMode = boardUI.viewMode;
    self.isPublic = boardUI.isPublic;
    self.viewOnly = boardUI.viewOnly;
    self.hasAccess = boardUI.hasAccess;

    self.activities = boardUI.activities;
    self.columns = boardUI.columns;
    self.members = boardUI.members;
    self.cardTypes = boardUI.cardTypes
    self.resequence = boardUI.columns.resequenceAll;
    

    // computed observables
    self.canChangeSettings = ko.computed(function () {
        return (self.owner() == app.user.userName) || !self.viewOnly();
    });

    self.canArchiveBoard = ko.computed(function () {
        return self.owner() == app.user.userName;
    });

    self.canRemoveMember = ko.computed(function () {
        return self.owner() == app.user.userName;
    });

    self.canRemoveMember = ko.computed(function () {
        return self.owner() == app.user.userName;
    });

    // operations
    self.changeBoardName = function () {
        var repository = new BoardRepository();
        repository.boardId=self.boardId();
        repository.name=self.name();
        repository.update().done(function (result) {
            $.Notify.show('Board name has been changed.');
            BoardContext.current.hub.notify.onBoardNameChanged(result.data.boardId, result.data.name, result.activityContext);
            app.ui.appNavigationBar.updateBoardName(self.boardId(), self.name());
            app.ui.appNavigationBar.selectedMenu(self.name());
        });
    }

    self.changeVisibility = function () {
        self.isPublic(!self.isPublic());
        var repository = new BoardRepository();
        repository.boardId=self.boardId();
        repository.isPublic=self.isPublic();
        repository.changeVisibility().done(function (result) {
            $.Notify.show('Board visibility has been changed.');
            BoardContext.current.hub.notify.onBoardVisibilityChanged(result.data.boardId, result.data.isPublic, result.activityContext);
        });
    }

    self.changeColumnVisibility = function (column) {
        column.show(!column.show());
        var repository = new BoardColumnRepository();
        repository.boardId = column.boardId();
        repository.columnId = column.columnId();
        repository.hidden = !column.show();
        repository.toggle().done(function (result) {
            BoardContext.current.hub.notify.onColumnVisibilityChanged(result.data.boardId, result.data.columnId, !result.data.hidden, result.activityContext);
        });
    }

    self.filters = {
        title: ko.observable(),
        tags: ko.observableArray(),
        cardTypes: ko.observableArray(),
        assignees: ko.observableArray(),
        noSelection: function(){
            return (self.filters.tags().length == 0) &&
                    ((self.filters.title() == null) || (self.filters.title().length == 0)) &&
                    (self.filters.cardTypes().length == 0) &&
                    (self.filters.assignees().length == 0);
        },
        isColorSelected: function(color){
            return (ko.utils.arrayFirst(self.filters.cardTypes(), function (cardType) {
                return cardType.color() == color;
            }) != null);
        },
        isAssigneeSelected: function (userName) {
            return (ko.utils.arrayFirst(self.filters.assignees(), function (assignee) {
                return assignee == userName;
            }) != null);
        },
        addColorToFilter: function (cardType) {
            if (self.filters.isColorSelected(cardType.color()))
                self.filters.cardTypes.remove(cardType);
            else 
                self.filters.cardTypes.push(cardType);
        },
        addAssigneeToFilter: function (assignee) {
            if (self.filters.isAssigneeSelected(assignee))
                self.filters.assignees.remove(assignee);
            else
                self.filters.assignees.push(assignee);
        },
        applyFilter: function () {
            if (self.filters.noSelection()) {
                ko.utils.arrayForEach(self.columns(), function (column) {
                    column.sortable(true);
                    ko.utils.arrayForEach(column.cards(), function (card) {
                        card.show(true);
                    })
                });
            } else {
                ko.utils.arrayForEach(self.columns(), function (column) {
                    column.sortable(false);
                    ko.utils.arrayForEach(column.cards(), function (card) {
                        card.show(false);
                        if (self.filters.title() != null && self.filters.title().length > 0) {
                            if (card.title().toLowerCase().indexOf(self.filters.title()) !== -1)
                                card.show(true);
                        }
                        if (self.filters.tags().length > 0) {
                            ko.utils.arrayForEach(self.filters.tags(), function (tag) {
                                if ($.inArray(tag, card.tags()) > -1) {
                                    card.show(true);
                                }
                            })
                        }
                        if (self.filters.cardTypes().length > 0) {
                            ko.utils.arrayForEach(self.filters.cardTypes(), function (cardType) {
                                if (card.color() == cardType.color()) {
                                    card.show(true);
                                }
                            })
                        }
                        if (self.filters.assignees().length > 0) {
                            ko.utils.arrayForEach(self.filters.assignees(), function (assignee) {
                                if (card.assignedToUser() == assignee) {
                                    card.show(true);
                                }
                            })
                        }
                    });
                });
            }
            
        },
        removeFilter: function () {
            self.filters.tags.removeAll();
            self.filters.cardTypes.removeAll();
            self.filters.assignees.removeAll();
            self.filters.title(null);
            $('#tags-container-filter').tagit('reset');
        }
    }

    self.filters.title.subscribe(function (newValue) {
        self.filters.applyFilter();
    })

    self.filters.tags.subscribe(function (changes) {
        self.filters.applyFilter();
    }, null, "arrayChange")
   
    self.filters.cardTypes.subscribe(function (changes) {
        self.filters.applyFilter();
    }, null, "arrayChange")

    self.filters.assignees.subscribe(function (changes) {
        self.filters.applyFilter();
    }, null, "arrayChange")


    // members
    self.newMember = {
        userName: ko.observable(),
        lookupUser: function (request, response) {
            $.ajax({
                url: '/api/user/',
                type: 'GET',
                dataType: 'json',
                data: { name: request.term },
                success: function (data) {
                    response($.map(data, function (name, val) {
                        return { label: name, value: name, id: val }
                    }))
                }
            })
        },
        add: function () {
            if (self.newMember.userName() != null && self.newMember.userName() != '') {
                var repository = new BoardMemberRepository();
                repository.boardId = self.boardId();
                repository.userName = self.newMember.userName();
                repository.create().done(function (result) {
                    if (self.getMember(result.data.boardMemberId) == null) {
                        self.members.push(new BoardMember(result.data));
                        BoardContext.current.hub.notify.onCollaboratorAdded(BoardContext.current.boardId(), result.data, result.activityContext);
                    }
                    self.newMember.userName('');
                });
            }
        }
    }

    self.getMember = function(boardMemberId){
        return ko.utils.arrayFirst(self.members(), function (member) {
            return member.boardMemberId() == boardMemberId
        });
    }

    self.removeMember = function () {
        $.each(self.members(), function (index, value) {
            if (value.selected())
                value.remove().done(function () {
                    self.selectedMember.boardMemberId(0);
                    self.selectedMember.fullName('');
                    self.selectedMember.userName('');
                });;
        })
    }

    self.selectedMembers = ko.computed(function () {
        return ko.utils.arrayFilter(self.members(), function (member) {
            return member.selected() ? member : null;
        })
    });

    self.selectMember = function (member) {
        if (member.selected()) {
            self.selectedMember.boardMemberId(0);
            self.selectedMember.userName('');
            self.selectedMember.fullName('');
            member.selected(false);
        }
        else {
            self.selectedMember.boardMemberId(member.boardMemberId());
            self.selectedMember.userName(member.userName());
            self.selectedMember.fullName(member.fullName());
            member.selected(true);
        }
        $.each(self.members(), function (index, value) {
            if (value != member)
                value.selected(false);
        })
    }

    self.selectedMember = {
        boardMemberId: ko.observable(),
        userName: ko.observable(),
        fullName: ko.observable()
    }

    // delete the current board
    self.remove = function () {
        if ((self.columns().length > 0) || (self.members().length > 0)) {

        }
        if (confirm('This will delete all cards on this board.  Continue?')) {
            var repository = new BoardRepository();
            repository.boardId = self.boardId();
            repository.remove().done(function () {
                app.ui.appNavigationBar.removeBoardMenuItem(self.boardId());
                app.router.go('/#/boards');       
            });
        }
    }
    
    $('.slide-out-div').tabSlideOut({
        tabHandle: '.handle',                     //class of the element that will become your tab
        //pathToTabImage: '/content/images/contact_tab.gif', //path to the image for the tab //Optionally can be set using css
        imageHeight: '122px',                     //height of tab image           //Optionally can be set using css
        imageWidth: '50px',                       //width of tab image            //Optionally can be set using css
        tabLocation: 'right',                      //side of screen where tab lives, top, right, bottom, or left
        speed: 300,                               //speed of animation
        action: 'click',                          //options: 'click' or 'hover', action to trigger animation
        topPos: '46px',                          //position from the top/ use if tabLocation is left or right
        leftPos: '20px',                          //position from left/ use if tabLocation is bottom or top
        fixedPosition: true                      //options: true makes it stick(fixed position) on scroll
    });

    
    $(window).resize(function () {
        // resize the height of the charms sidebar when window resizes 
        $('.slide-out-div').height($(this).outerHeight());
        // resize the height columns div when window resizes 
        $('#Sidebar_columns').find('ul li:nth-child(2) > div').height($(this).outerHeight() - 180);
        $('#Sidebar_activities').find('ul li:nth-child(2) > div').height($(this).outerHeight() - 180);
    });

    // trigger the resize
    $(window).resize();

   

    $('#tags-container-filter').tagit({
        allowNewTags: false,
        triggerKeys: ['enter', 'tab'],
        tagSource: function (request, response) {
            $.ajax({
                url: '/api/{0}/tags/'.format(self.boardId()),
                type: 'GET',
                dataType: 'json',
                data: { name: request.term, boardId: self.boardId() },
                success: function (data) {
                    response($.map(data, function (name, val) {
                        return { label: name, value: name, id: val }
                    }))
                }
            })
        },
        tagsChanged: function (tagValue, action, element) {
            if (action == 'added') {
                self.filters.tags.push(tagValue);
            } else if (action == 'popped') {
                self.filters.tags.remove(tagValue);
            }
        }
    })

}
