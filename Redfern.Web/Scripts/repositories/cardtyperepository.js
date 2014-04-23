function CardTypeRepository() {
    var self = this;

    self.cardTypeId = ko.observable();
    self.name = ko.observable();
    self.colorCode = ko.observable();

    
    self.update = function () {
        return $.ajax({
            url: '/api/cardtype/'+self.cardTypeId(),
            type: 'put',
            data: {
                CardTypeId: self.cardTypeId(),
                Name: self.name(),
                ColorCode : self.colorCode()
            }
        });
    }

    
}