import { Session } from "meteor/session";
import xss from 'xss'
import moment from 'moment-with-locales-es6'
import showdown from 'showdown'
import Remarkable from 'remarkable';

var Autolinker = require('autolinker');

const steemMarkdown = require('steem-markdown-only')

Template.registerHelper('imgFromArray', function (project) {
    if (!project) return
    if ($.isArray(project.json_metadata.image)) {
        if (project.json_metadata.image[0]) {
            return project.json_metadata.image[0]
        }
    }
})

Template.registerHelper('imgFromBody', function (project) {
    if (!project) return
    else {
        var __imgRegex = /https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,})))/gi;
        if (__imgRegex.test(project.body)) {

            return 'https://steemitimages.com/0x0/' + project.body.match(__imgRegex)[0];
        }
        else {
            return false
        }
    }
})

Template.registerHelper('isBlacklisted', function (name) {
    if(!Session.get('settings').blacklist.includes(result[i].author))
    return false
    else
    return true
});



Template.registerHelper('translator', function (code) {
    return translate(code);
});

Template.registerHelper('xssFormatter', function (text) {
    if (!text) return text;
    var converter = new showdown.Converter({ parseImgDimensions: true }),
        html = converter.makeHtml(text);
    return html;
})

Template.registerHelper('remarkableFormatter', function (text) {
    text = steemMarkdown(text)
    var autolinker = new Autolinker({
        urls: {
            schemeMatches: true,
            wwwMatches: true,
            tldMatches: true
        },
        email: true,
        phone: true,
        mention: 'steemit',
        hashtag: 'steemit',
        stripPrefix: false,
        stripTrailingSlash: false,
        newWindow: true,

        truncate: {
            length: 0,
            location: 'end'
        },

        className: ''
    });

    return autolinker.link(text);
})

function parseURL($string) {
    var __imgRegex = /^https?[^ \!@\$\^&\(\)\+\=]+(\.png|\.jpeg|\.gif|\.jpg)$/;
    var exp = __imgRegex;
    return $string.replace(exp, function (match) {
        __imgRegex.lastIndex = 0;
        if (__imgRegex.test(match)) {
            return match;
        }
    }
    )
}

Template.registerHelper('isFollowing', function (following) {
    var followers = Followers.findOne({ follower: MainUser.find().fetch()[0].name, following: following })
    if (followers) return true
    return false;
})

Template.registerHelper('shortDescription', function (string) {
    return string.slice(0, 150) + " ..."
})

Template.registerHelper('xssShortFormatter', function (text) {
    if (!text) return text;
    var converter = new showdown.Converter(),
        text = converter.makeHtml(text);
    var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
    text = text.replace(urlPattern, "")
    text = text.replace(/<img[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g, "");
    text = text.replace(/<(?:.|\n)*?>/gm, '');
    //-- remove BR tags and replace them with line break
    text = text.replace(/<br>/gi, "\n");
    text = text.replace(/<br\s\/>/gi, "\n");
    text = text.replace(/<br\/>/gi, "\n");

    //-- remove P and A tags but preserve what's inside of them
    text = text.replace(/<p.*>/gi, "\n");
    text = text.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

    //-- remove all inside SCRIPT and STYLE tags
    text = text.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    text = text.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
    //-- remove all else
    text = text.replace(/<(?:.|\s)*?>/g, "");

    //-- get rid of more than 2 multiple line breaks:
    text = text.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\n\n");

    //-- get rid of more than 2 spaces:
    text = text.replace(/ +(?= )/g, '');

    //-- get rid of html-encoded characters:
    text = text.replace(/&nbsp;/gi, " ");
    text = text.replace(/&amp;/gi, "&");
    text = text.replace(/&quot;/gi, '"');
    text = text.replace(/&lt;/gi, '<');
    text = text.replace(/&gt;/gi, '>');
    text = text.replace(/\.[^/.]+$/, "")
    return text;
})

Template.registerHelper('colorfromcategory', function (tags) {
    var colors = Session.get('customtags')
    for (i = 0; tags.length > i; i++) {
        if (colors.find(item => item.category === tags[i]) && tags[i] != "steemstem") {
            var item = colors.find(item => item.category === tags[i])
            return item.color
        }
    }
})

Template.registerHelper('colorByCategory', function (tag) {
    var colors = Session.get('customtags')
    if (colors.find(item => item.category === tag) && tag != "steemstem") {
        var item = colors.find(item => item.category === tag)
        return item.color
    }
})

Template.registerHelper('xssTxtFormatter', function (text) {
    if (!text) return text;
    var converter = new showdown.Converter(),
        text = converter.makeHtml(text);
    var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
    text = text.replace(/<img[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g, "");


    //-- remove all inside SCRIPT and STYLE tags
    text = text.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
    //-- remove all else
    text = text.replace(/<(?:.|\s)*?>/g, "");

    //-- get rid of more than 2 multiple line breaks:
    text = text.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\n\n");
    return text;
})


Template.registerHelper('inequals', function (a, b) {
    return a !== b;
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.registerHelper('settingsLoaded', function () {
    return Session.get('settings')
});

Template.registerHelper('displayDate', function (date) {
    return moment(date).format('MMMM Do YYYY');
})

Template.registerHelper('displayDateFull', function (date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
})

Template.registerHelper('DisplayTimeFrom', function (date) {
    if (!date) return
    return moment(date + 'Z').fromNow()
})

Template.registerHelper('DisplayTimeCreated', function (date) {
    if (!date) return
    return moment(date).format("ll")
})

Template.registerHelper('displayUpvote', function (share, rewards) {
    return (share * rewards).toFixed(3);
})


Template.registerHelper('displayReputation', function (string) {
    return steem.formatter.reputation(string);
})

Template.registerHelper('EstimateAccount', function (user) {

    if (Coins.findOne({ 'id': 'steem' }) && Coins.findOne({ 'id': 'steem-dollars' })) {
        var balanceSteem = parseFloat(user.balance.split(' ')[0])
        var balanceVests = parseFloat(user.vesting_shares.split(' ')[0])
        var balanceSbd = parseFloat(user.sbd_balance.split(' ')[0])
        var balanceUsd = 0

        balanceUsd += Coins.findOne({ 'id': 'steem' }).price_usd * vestToSteemPower(balanceVests)
        balanceUsd += Coins.findOne({ 'id': 'steem' }).price_usd * balanceSteem
        balanceUsd += Coins.findOne({ 'id': 'steem-dollars' }).price_usd * balanceSbd
        return parseFloat(balanceUsd).toFixed(2)
    }
    else {
        return 0

    }
})

Template.registerHelper('isSubscribed', function (following) {
    var sub = Subs.findOne({ follower: MainUser.find().fetch()[0].name, following: following })
    if (sub) return true
    return false;
})



Template.registerHelper('DisplayVotingPower', function (votingPower, lastVoteTime, precision) {
    if (isNaN(votingPower)) return
    var secondsPassedSinceLastVote = (new Date - new Date(lastVoteTime + "Z")) / 1000;
    votingPower += (10000 * secondsPassedSinceLastVote / 432000);
    return Math.min(votingPower / 100, 100).toFixed(precision)
})


Template.registerHelper('DisplaySteemPower', function (vesting_shares, delegated, received_vesting_shares) {
    if (vesting_shares || delegated || received_vesting_shares) {
        var SP = 0;
        SP = SP + Number(vestToSteemPower(vesting_shares.split(' ')[0]))
        SP = SP - Number(vestToSteemPower(delegated.split(' ')[0]))
        if (received_vesting_shares)
            SP = SP + Number(vestToSteemPower(received_vesting_shares.split(' ')[0]))
        return parseFloat(SP).toFixed(3) + ' STEEM'
    }
})


Template.registerHelper('vestToSteemPower', function (userVests) {
    var globals = JSON.parse(localStorage.steemProps)
    var totalSteem = parseFloat(globals.total_vesting_fund_steem.split(' ')[0])
    var totalVests = parseFloat(globals.total_vesting_shares.split(' ')[0])
    userVests = userVests.split(' ')[0]
    var SP = totalSteem * (userVests / totalVests)
    return parseFloat(SP).toFixed(3) + ' SP'
})

Template.registerHelper('displayRewards', function (text) {
    if (!text) return text;
    text = text.replace(/(?:\r\n|\r|\n)/g, ' ');
    var array = [];
    var str = text,
        rg = /\[REWARD(.+?)\]/g, match;
    while (match = rg.exec(str)) {
        array.push(match[1].split(':'))
    }
    return array;
})

function vestToSteemPower(userVests) {
    if (JSON.parse(localStorage.steemProps) && userVests) {
        var globals = JSON.parse(localStorage.steemProps)
        var totalSteem = parseFloat(globals.total_vesting_fund_steem.split(' ')[0])
        var totalVests = parseFloat(globals.total_vesting_shares.split(' ')[0])
        var SP = totalSteem * (userVests / totalVests)
        return SP
    }
}

Template.registerHelper('isMobile', function () {
    if (/Mobi/.test(navigator.userAgent)) {
        return true;
    }
    return false;
});

Template.registerHelper('guestuser', function () {
    if (!Session.get('guestuser')) return
    else {
        var guestuser = Session.get('guestuser')
        return guestuser
    }
})

Template.registerHelper('mainuser', function () {
    if (!MainUser.find().fetch()) return
    else {
        var user = MainUser.find().fetch()
        return user[0]
    }
})

Template.registerHelper('visibleContents', function () {
    return Session.get('visiblecontent')
})

Template.registerHelper('userdata', function () {
    return Session.get('userdata')
})

Template.registerHelper('drafts', function () {
    return Session.get('userdata').drafts
})

Template.registerHelper('unfiltered', function () {
        return Session.get('unfiltered')
})

Template.registerHelper('currentSearch', function () {
    if (Session.get('currentSearch'))
        return Session.get('currentSearch')
    else
        return 'steemstem'
})

Template.registerHelper('whitelist', function () {
    if (Session.get('settings'))
        return Session.get('settings').whitelist
})

Template.registerHelper('isWhitelisted', function (user_permlink) {
    if (Session.get('settings'))
        var whitelist = Session.get('settings').whitelist
    if (whitelist.includes(user_permlink))
        return true
})

Template.registerHelper('isBlacklisted', function (user_permlink) {
    if (Session.get('settings'))
        var blacklist = Session.get('settings').blacklist
    if (blacklist.includes(user_permlink))
        return true
})


Template.registerHelper('MainUserRate', function (project) {
    if (!project || !project.active_votes || !project.net_votes) return
    if (project.active_votes.length) {
        for (var i = 0; i < project.active_votes.length; i++) {
            if (project.active_votes[i].voter == localStorage.username
                && parseInt(project.active_votes[i].percent) > 0)
                return parseFloat(project.active_votes[i].percent / 100).toFixed(0)
        }
    }
    else {
        if (project.net_votes.length) {
            for (var i = 0; i < project.net_votes.length; i++) {
                if (project.net_votes[i].voter == localStorage.username
                    && parseInt(project.net_votes[i].percent) > 0)
                    return parseFloat(project.net_votes[i].percent / 100).toFixed(0)
            }
        }
    }

})

Template.registerHelper('displayPayout', function (active, total, voter) {
    if (active && !total || !voter) return active
    if (!active || !total || !voter) return
    var payout = active
    if (total.split(' ')[0] > 0) {
        var amount = parseInt(total.split(' ')[0].replace('.', '')) + parseInt(voter.split(' ')[0].replace('.', ''))
        amount /= 1000
        payout = amount + ' SBD'
    }
    if (!payout) return
    var amount = payout.split(' ')[0]
    var currency = payout.split(' ')[1]
    amount = parseFloat(amount).toFixed(3)
    return amount;
})

Template.registerHelper('displayPayoutUpvote', function (share, rewards) {
    return (share * rewards).toFixed(3);
})

Template.registerHelper('displayAllVoters', function (votes, isDownvote) {
    if (!votes) return
    votes.sort(function (a, b) {
        var rsa = parseInt(a.rshares)
        var rsb = parseInt(b.rshares)
        return rsb - rsa
    })
    if (isDownvote) votes.reverse()

    var rsharesTotal = 0;
    for (let i = 0; i < votes.length; i++)
        rsharesTotal += parseInt(votes[i].rshares)

    var top300 = []
    for (let i = 0; i < 300; i++) {
        if (i == votes.length) break
        votes[i].rsharespercent = parseInt(votes[i].rshares) / rsharesTotal
        if (parseInt(votes[i].rshares) < 0 && !isDownvote) break;
        if (parseInt(votes[i].rshares) >= 0 && isDownvote) break;
        top300.push(votes[i])
    }
    return top300
})

Template.registerHelper('estimateAccount', function () {
    if (Coins.findOne({ 'id': 'steem' }) && Coins.findOne({ 'id': 'steem-dollars' })) {
        var balanceSteem = parseFloat(this.balance.split(' ')[0])
        var balanceVests = parseFloat(this.vesting_shares.split(' ')[0])
        var balanceSbd = parseFloat(this.sbd_balance.split(' ')[0])
        var balanceUsd = 0
        balanceUsd += Coins.findOne({ 'id': 'steem' }).price_usd * vestToSteemPower(balanceVests)
        balanceUsd += Coins.findOne({ 'id': 'steem' }).price_usd * balanceSteem
        balanceUsd += Coins.findOne({ 'id': 'steem-dollars' }).price_usd * balanceSbd
        return balanceUsd
    }
})


Template.registerHelper('displayVotersTop', function (votes, isDownvote) {
    if (!votes) return
    votes.sort(function (a, b) {
        var rsa = parseInt(a.rshares)
        var rsb = parseInt(b.rshares)
        return rsb - rsa
    })
    if (isDownvote) votes.reverse()

    var rsharesTotal = 0;
    for (let i = 0; i < votes.length; i++)
        rsharesTotal += parseInt(votes[i].rshares)

    var top20 = []
    for (let i = 0; i < 20; i++) {
        if (i == votes.length) break
        votes[i].rsharespercent = parseInt(votes[i].rshares) / rsharesTotal
        if (parseInt(votes[i].rshares) <= 0 && !isDownvote) break;
        if (parseInt(votes[i].rshares) >= 0 && isDownvote) break;
        top20.push(votes[i])
    }
    return top20
})

Template.registerHelper('isArray', function (array) {
    if (!array) return
    if ($.isArray(array))
        return true
    else return false
});


Template.registerHelper('customTags', function (array) {
    if (Session.get('customtags'))
        return Session.get('customtags')
});




//TODO CALCULATE VOTE VALUE
// var user = MainUser.findOne()
// var v = 0;
// var a, n, r, i, m, o = 1e4;
// var uvs = 0;
// uvs = Template.projectsidebar.DisplaySteemPower(user.vesting_shares)
// var urv = 0;
// urv = Template.projectsidebar.DisplaySteemPower(user.received_vesting_shares)
// var dvs = 0;
// dvs = Template.projectsidebar.DisplaySteemPower(user.delegated_vesting_shares)
// var steempower = 0;
// steempower = uvs + urv
// steempower -= dvs
// steem.api.getRewardFund("post", function (error, result) {
//     if (result) {
//         n = result.reward_balance, r = result.recent_claims, i = n.replace(" STEEM", "") / r;
//         steem.api.getCurrentMedianHistoryPrice(function (error, result) {
//             if (!error) {
//                 m = result.base.replace(" SBD", "") / result.quote.replace(" STEEM", "");
//                 steem.api.getDynamicGlobalProperties(function (t, n) {
//                     a = n.total_vesting_fund_steem.replace(" STEEM", "") / n.total_vesting_shares.replace(" VESTS", "");
//                     var e = steempower, t = 100, n = 100, r = e / a, p = parseInt(100 * t * (100 * n) / o);
//                     p = parseInt((p + 49) / 50);
//                     var l = parseInt(r * p * 100) * i * m;
//                     v = l.toFixed(4);
//                     var hv = parseFloat(v * 1000).toFixed(0)
//                     //console.log(hv)
//                     hv = hv -(hv/100*50)
//                     Session.set('votingvalue', hv) 
//                 });
//             }

//         });
//     }
// });