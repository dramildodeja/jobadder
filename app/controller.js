const moment = require('moment');
module.exports = function(app) {
    let access_token = null;
    app.get('/',function(req,res){
        res.render('index')
    });
    app.get('/:code',function(req,res){
        const axios = require('axios');
        const qs = require('qs');
        const data = qs.stringify({
            'client_id': 'tasnikug5dhe7dprx64miuzj2e',
            'client_secret': 'p2guzz5iyvquni3d3vd7eblsfy3hw2fhdy6wveppwz27jb3uk3fa',
            'grant_type': 'authorization_code',
            'code': req.params.code,
            'redirect_uri': 'https://jobadder-kpi-reports.herokuapp.com/'
        });
        const config = {
            method: 'post',
            url: 'https://id.jobadder.com/connect/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
        };
        axios(config)
        .then(function (response) {
            access_token = response.data.access_token
            res.render('home', {response: access_token})
        })
        .catch(function (error) {
            access_token = null;
            res.render('index', {error: error})
        });
    });

    app.get('/jobApplications/:token',function(req,res){
        res.render('jobApplications', {token: req.params.token})
    });

    app.post('/jobApplicationsByJobId',function(req,res){
        const axios = require('axios');
        const config = {
            method: 'get',
            url: 'https://api.jobadder.com/v2/jobs/'+req.body.jobId+'/applications',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+req.body.token
            }
        };
        axios(config)
        .then(function (response) {
            res.render('jobApplications', {jobApplicationsByJobId: response.data.items, token: req.body.token})
        })
        .catch(function (error) {
            res.render('jobApplications', {token: req.body.token, error: error})
        });
    });

    app.get('/candidateNotes/:candidateId/:token',function(req,res){
        const axios = require('axios');
        const config = {
            method: 'get',
            url: 'https://api.jobadder.com/v2/candidates/'+req.params.candidateId+'/notes',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+req.params.token
            }
        };
        axios(config)
        .then(function (response) {
            let items = response.data.items
            items.sort(function(a, b) {
                return new Date(a.updatedAt) - new Date(b.updatedAt);
            });
            const noteDateArry = []
            items.forEach(item => {
                noteDateArry.push(new Date(item.updatedAt.substr(0,item.updatedAt.length-1)))
            })
            items.forEach(item => {
                let updatedDate = new Date(new Date(item.updatedAt.substr(0,item.updatedAt.length-1)))
                let dateInNoteDateArry = noteDateArry[0]
                let Difference_In_Time = updatedDate.getTime() - dateInNoteDateArry.getTime();
                let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
                item['dayOfEngagement'] = Difference_In_Days < 1 ? 1 : Difference_In_Days;
            })
            res.render('candidateTimeline', {candidateNotes: items, token: req.params.token, moment: moment})
        })
        .catch(function (error) {
            res.render('candidateTimeline', {token: req.params.token, error: error})
        });
    });

    app.get('/candidateNotesSnapShot/:candidateId/:token',function(req,res){
        const axios = require('axios');
        const config = {
            method: 'get',
            url: 'https://api.jobadder.com/v2/candidates/'+req.params.candidateId+'/notes',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+req.params.token
            }
        };
        axios(config)
        .then(function (response) {
            let items = response.data.items
            items.sort(function(a, b) {
                return new Date(a.updatedAt) - new Date(b.updatedAt);
            });
            const noteDateArry = []
            items.forEach(item => {
                noteDateArry.push(new Date(item.updatedAt.substr(0,item.updatedAt.length-1)))
            })
            items.forEach(item => {
                let updatedDate = new Date(new Date(item.updatedAt.substr(0,item.updatedAt.length-1)))
                let dateInNoteDateArry = noteDateArry[0]
                let Difference_In_Time = updatedDate.getTime() - dateInNoteDateArry.getTime();
                let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
                item['dayOfEngagement'] = Difference_In_Days < 1 ? 1 : Difference_In_Days;
            })
            res.render('candidateTimelineSnapShot', {candidateNotes: items, token: req.params.token, moment: moment})
        })
        .catch(function (error) {
            res.render('candidateTimelineSnapShot', {token: req.params.token, error: error})
        });
    });
}