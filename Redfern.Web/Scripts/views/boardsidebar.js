function BoardSidebar(boardUI) {

    var boardUI = boardUI,
        self = this;

    self.activeOption = ko.observable('main');
    self.boardId = boardUI.boardId;
    self.name = boardUI.name;
    self.owner = boardUI.owner;
    self.ownerFullName = boardUI.ownerFullName;
    self.viewMode = boardUI.viewMode;
    self.columns = boardUI.columns;
    self.members = boardUI.members;
    self.cardTypes = boardUI.cardTypes
    
    self.canArchiveBoard = ko.computed(function () {
        return self.owner() == app.user.userName;
    });

    self.canChangeSettings = ko.computed(function () {
        return self.owner() == app.user.userName;
    });

    self.canRemoveMember = ko.computed(function () {
        return self.owner() == app.user.userName;
    });


    
    self.changeBoardName = function () {
        var repository = new BoardRepository();
        repository.boardId(self.boardId());
        repository.name(self.name());
        repository.update().done(function () {
            $.Notify.show('Board name has been changed.');
            app.ui.appNavigationBar.updateBoardName(self.boardId(), self.name());
            app.ui.appNavigationBar.selectedMenu(self.name());
        });
    }

    self.filters = {
        title: ko.observable(),
        tags: ko.observableArray(),
        applyFilter: function () {
            var cards = [];
            if ((self.filters.tags().length == 0)  && (self.filters.title().length == 0)) {
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
                        if (self.filters.title() != null) {
                            if (card.title().toLowerCase().indexOf(self.filters.title()) !== -1)
                                cards.push(card);
                        }
                    })
                    if (cards.length == 0) cards = column.cards();
                    ko.utils.arrayForEach(cards, function (card) {
                        card.show(true);
                        ko.utils.arrayForEach(self.filters.tags(), function (tag) {
                            if ($.inArray(tag, card.tags()) == -1) {
                                card.show(false);
                            } 
                        })
                    })

                });
            }
            
           
        }

    }

    self.filters.title.subscribe(function (newValue) {
        self.filters.applyFilter();
    })

    self.filters.tags.subscribe(function (changes) {
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
            var repository = new BoardMemberRepository();
            repository.boardId(self.boardId());
            repository.userName(self.newMember.userName());
            repository.create().done(function (result) {
                if (self.getMember(result.BoardMemberId) == null){
                    self.members.push(new BoardMember(result, boardUI));
                }
                self.newMember.userName('');
            });
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
                    self.members.remove(value);
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
            repository.boardId(self.boardId());
            repository.remove().done(function () {
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

    // resize the hieght of the charms sidebar when window resizes 
    $(window).resize(function () {
        $('.slide-out-div').height($(this).outerHeight());
    })

    $('#tags-container-filter').tagit({
        allowNewTags: false,
        triggerKeys: ['enter', 'tab'],
        tagSource: function (request, response) {
            $.ajax({
                url: '/api/tag/',
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
        tagsChanged: function (tagValue, action, element) {
            if (action == 'added') {
                self.filters.tags.push(tagValue);
            } else if (action == 'popped') {
                self.filters.tags.remove(tagValue);
            }
        }
    })

}
