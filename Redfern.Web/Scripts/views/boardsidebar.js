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
    
    // subscriptions 
    self.activeOption.subscribe(function (newValue) {
        if (newValue == 'activities')
            $.boardcontext.current.newActivitiesCounter(0);
    })

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

    self.notifications = ko.computed(function () {
        // get any general notifications
        var notifications = ko.utils.arrayFilter($.hubclientcontext.notificationsHub.notifications(), function (notification) {
            
            if (notification.objectType() == 'card') {
                return notification.objectId().split(';')[0].split('=')[1] == $.boardcontext.current.boardId();
            }
            return false;
        })

        // get notifications of due or over due cards on the board
        var dueCards = [],
            columns = $.boardcontext.current.columns;
        $.each(columns(), function (x,column) {
            $.each(column.cards(), function (y,card) {
                if (card.dueDate() != null) {
                    dueCards.push(new Notification({
                            notificationId: 0,
                            notificationDate: moment(),
                            sender: 'None',
                            senderUserFullName: 'None',
                            notificationType: 'DueCard',
                            objectType: 'card',
                            objectId: 'BoardId={0};CardId={1}'.format(card.boardId(), card.cardId()),
                            objectDescription: card.title(),
                            dueDate: card.dueDate()
                        }));
                }
            })
        })
        if (dueCards.length > 0) {
            dueCards.sort(function (a, b) {
                return new Date(a.dueDate()) - new Date(b.dueDate());
            })
        }

        return notifications.concat(dueCards);
    })

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

    self.filters = new BoardFilters(self.columns);

    
    // members
    self.newMember = {
        userName: ko.observable(),
       
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
        imageHeight: '222px',                     //height of tab image           //Optionally can be set using css
        imageWidth: '150px',                       //width of tab image            //Optionally can be set using css
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
        $('#Sidebar_filter').find('ul li:nth-child(2) > div').height($(this).outerHeight() - 180);
    });

    // trigger the resize
    $(window).resize();

   
    
}
