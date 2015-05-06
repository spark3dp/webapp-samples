var ADSKSpark = ADSKSpark || {};


ADSKSpark.TaskWaiter = function( progressCallback )
{
    var Client = ADSKSpark.Client;
    var _this = this;
    var _taskId, _interval;

    this._checkTaskResponse = function(taskResponse)
    {
        var delayPromise;

        console.log("Task status: ", taskResponse.status, "progress:", taskResponse.progress);

        if( taskResponse.status === 'done' )
        {
            var result = taskResponse.result;
            return result;
        }
        if( taskResponse.status === 'error' )
        {
            return Promise.reject(taskResponse);
        }
        if( progressCallback )
            progressCallback( taskResponse.progress );

        console.log("Delay task");

        return new Promise(function(resolve) {
            setTimeout(function() { resolve(); }, _interval);
        }).then( _this._pollTask );
    }


    this._pollTask = function()
    {
        console.log("Poll task");
        return Client.authorizedApiRequest('/print/tasks/' + _taskId)
                .get().then(_this._checkTaskResponse);
    }


    this.wait = function(opResult, interval) 
    {
        interval = interval || 100;
        if( interval < 10 )
            interval = 10;

        _taskId = opResult.id; // or is it body.id ?
        _interval = interval;


        return _this._pollTask();
    };
};
