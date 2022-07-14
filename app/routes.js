module.exports = function(app) {
    let access_token = null;
    app.get('/',function(req,res){
        res.render('index')
    });
    app.get('/:code',function(req,res){
        const axios = require('axios');
        const qs = require('qs');
        const data = qs.stringify({
            'client_id': 'cmss7eboxczubpgyuufooiy6n4',
            'client_secret': 'p5ay7pflpoiu3o64ickrwo4zoqo4tsb2vt7q5upil5iy25sxap3m',
            'grant_type': 'authorization_code',
            'code': req.params.code,
            'redirect_uri': 'https://dcgla.com/'
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

    app.get('/candidateTimeline/:token',function(req,res){
        res.render('candidateTimeline', {token: req.params.token})
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
            res.render('candidateTimeline', {jobApplicationsByJobId: response.data.items, token: req.body.token})
        })
        .catch(function (error) {
            res.render('candidateTimeline', {token: req.body.token, error: error})
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
                res.render('candidateTimeline', {candidateNotes: items, token: req.params.token})
            })
            .catch(function (error) {
                res.render('candidateTimeline', {token: req.params.token, error: error})
            });
    });
}