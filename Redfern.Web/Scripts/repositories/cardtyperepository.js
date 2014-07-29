function CardTypeRepository() {
    var self = this;

    self.cardTypeId = null;
    self.name = null;
    self.colorCode = null;

    
    self.update = function () {
        var postData = {
            CardTypeId: self.cardTypeId
        };
        if (self.name != null) postData.Name = self.name;
        if (self.colorCode != null) postData.ColorCode = self.colorCode;
        return $.ajax({
            url: '/api/cardtype/'+self.cardTypeId,
            type: 'put',
            data: postData
        });
    }

    
}