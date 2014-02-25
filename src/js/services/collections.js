
app.factory("collectionService", function () {

    var queryType = {
        daily : "Daily",
        monthly : "Monthly",
        yearly : "Yearly"
    };

    function QueryInfo() {
        this.queryType = queryType.daily;

        // Daily
        this.dailyMonth = 0;
        this.dailyYear = 0;

        // Monthly
        this.monthlyFrom = 0;
        this.monthlyTo = 0;

        // Yearly
        this.yearlyFrom = 0;
        this.yearlyTo = 0;

        // All type
        this.timeFrom = 0;
        this.timeTo = 0;

        Object.preventExtensions(this);
    };

    function Property(key, value) {
        this.key = key;
        this.value = value;
    }

    var timeList = [];
    var monthList = [];
    var yearList = [];

    for(var i = 0 ; i< 24; i++){
        var value = (i+1).toString();

        var time = new Property(i, ("00" + value + ".00").substring(value.length));
        timeList.push(time);
    }

    for(var i = 0; i< 12; i++){
        var text = moment(new Date(2012, i, 10)).format("MMMM");
        var month = new Property(i,text);
        monthList.push(month);
    }

    for(var i = 2013; i < 2016; i++){
        var year = new Property(i, i.toString());
        yearList.push(year);
    }

    return {
        yearList : yearList,
        monthList : monthList,
        timeList : timeList,
        QueryInfo : QueryInfo,
        queryType : queryType
    }
});