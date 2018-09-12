import './buffer';
import './main.html';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import steem from 'steem';
import sc2sdk from 'sc2-sdk';

FlowRouter.wait();

BlazeLayout.setRoot('body');

var sc2 = sc2sdk.Initialize({
    baseURL: 'https://steemconnect.com', 
    app: 'fundition.org',
    callbackURL: 'http://testdev.fundition.io/login',
    accessToken: 'access_token',
    //scope: ['vote','comment']
});
window.sc2 = sc2

window.steem = steem;


Meteor.startup(function () {
    Session.set('settings',false)

    coinmarket.steemdollars()
    coinmarket.steem()

    steem.api.getOrderBook(1, function (err, result) {
        if (!err) {
            Session.set("sbdmarketprice", Number(result.asks[0].real_price).toFixed(2));
        }
    });
    steem.api.getCurrentMedianHistoryPrice(function (error, result) {
        if (!error) {
            var sbd = result.base.split(' ')[0]
            Session.set('sbdprice', sbd)
        }
    });

    //LOAD SETTINGS FROM STEEMSTEM.SETUP ACCOUNT
    steem.api.getAccounts(['steemstem.setup'], function (error, result) {
        if (!result) {
            return
        }
        for (var i = 0; i < result.length; i++) {
            try {
                result[i].json_metadata = JSON.parse(result[i].json_metadata)
            } catch (error) {
                console.log(error)
            }
            Session.set('settings', result[i].json_metadata.steemstem_settings)
            Session.set('customtags', result[i].json_metadata.steemstem_settings.tags)
            for (var b = 0; b < result[i].json_metadata.steemstem_settings.featured.length; b++)
            {
                var link = result[i].json_metadata.steemstem_settings.featured[b].split('/')
                Content.getContent(link[0], link[1], function (error) {
                    if (error) {
                        console.log(error)
                    }
                })
            }
        }
    });

    //LOAD GLOBAL PROPERTIES
    var sendDate = (new Date()).getTime();
    steem.api.getDynamicGlobalProperties(function (err, result) {
        if (result) {
            var receiveDate = (new Date()).getTime();
            var responseTimeMs = receiveDate - sendDate;
            console.log('Global Properties loaded in : ' + responseTimeMs + "ms")
            localStorage.setItem('steemProps', JSON.stringify(result))
        }
        else {
            steem.api.setOptions({ url: 'https://rpc.buildteam.io' });
            steem.api.getDynamicGlobalProperties(function (err, result) {
                if (result) {
                    var receiveDate = (new Date()).getTime();
                    var responseTimeMs = receiveDate - sendDate;
                    console.log('Global Properties loaded in : ' + responseTimeMs + "ms")
                    localStorage.setItem('steemProps', JSON.stringify(result))
                }
                else {
                    steem.api.setOptions({ url: 'https://rpc.steemviz.com/' });
                    steem.api.getDynamicGlobalProperties(function (err, result) {
                        if (result) {
                            var receiveDate = (new Date()).getTime();
                            var responseTimeMs = receiveDate - sendDate;
                            console.log('Global Properties loaded in : ' + responseTimeMs + "ms")
                            localStorage.setItem('steemProps', JSON.stringify(result))

                        }
                    })
                }
            })
        }
    })


    var factaccounts = [
        { name: 'steemcomment-1', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXBwIiwicHJveHkiOiJmYWN0aXQuYXBwIiwidXNlciI6InN0ZWVtY29tbWVudC0xIiwic2NvcGUiOlsib2ZmbGluZSIsImNvbW1lbnQiXSwiaWF0IjoxNTI0NjU2NDE2LCJleHAiOjE1MjUyNjEyMTZ9.X6DCNSdEewHQxaAmuzBx6MVmV1dzSCnit7DGgP_XbrA' },
        { name: 'steemcomment-2', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXBwIiwicHJveHkiOiJmYWN0aXQuYXBwIiwidXNlciI6InN0ZWVtY29tbWVudC0yIiwic2NvcGUiOlsib2ZmbGluZSJdLCJpYXQiOjE1MjQyMDczNTUsImV4cCI6MTUyNDgxMjE1NX0.YFZXbeeuiMifY0J-609wvZknIpsW9Pr_jkvX_CnUUAg' },
        { name: 'steemcomment-3', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXBwIiwicHJveHkiOiJmYWN0aXQuYXBwIiwidXNlciI6InN0ZWVtY29tbWVudC0zIiwic2NvcGUiOlsib2ZmbGluZSJdLCJpYXQiOjE1MjQyMjY5OTcsImV4cCI6MTUyNDgzMTc5N30.IH6i3lIbB6rZnF90R_Byw2ZcYRamA_UPMxvNqnivAEI' }
    ]

    Session.set('factaccounts', factaccounts)
    if (localStorage.guestuser) {
        Session.set('guestuser', localStorage.guestuser)
    }

    
    AccountHistory.getAccountHistory('steemstem',-1,500, function (error) {
       if (error)
           console.log(error)
    })

    Session.set('currentVotingPercentage', 50)
    Session.set('visiblecontent',18)

    

    window.loadLanguage(function(result){
        if(result)
        console.log(result)
    })

    FlowRouter.initialize({ hashbang: true }, function () {
    });
    Content.chainLoad()
    console.log(
        `%c WARNING !!!`,
        "background: #db2828; color: white; font-size: 18px; padding: 3px 3px;"
    );
    console.log(
        `%c THIS FEATURE IS DESIGNED FOR DEVELOPERS. ANYTHING YOU PASTE OR TYPE HERE CAN COMPROMISE YOUR ACCOUNT AND YOUR PRIVATE KEYS.`,
        "background: white; color: black; font-size: 16px; padding: 3px 3px;"
    );
    console.log(
        `%c More informations on : https://steemstem.io`,
        "background: #db2828; color: white; font-size: 12px; padding: 3px 3px;"
    );
    console.log(
        `%c All rights : https://steemit.com/@futureshock`,
        "background: #db2828; color: white; font-size: 12px; padding: 3px 3px;"
    );
    console.log(
        `%c Made with love by : @planetenamek & @hightouch`,
        "background: #db2828; color: white; font-size: 12px; padding: 3px 3px;"
    );
})


