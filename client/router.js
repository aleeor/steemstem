import { Template } from "meteor/templating";
import { Session } from "meteor/session";

FlowRouter.route('/', {
    name: 'home',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "home", topmenu: "topmenu" });
        $('.actived').removeClass('actived')
        $('.steemstem.home').addClass('actived')
        Session.set('currentFilter', false)
        Session.set('currentSearch', false)
        Session.set('currentTag', false)
        Session.set('isonreply', false)
        // Content.getContentByBlog('steemstem',36,'steemstem',function (error) {
        //     if (error) {
        //         console.log(error)
        //     }
        // })
        Session.set('visiblecontent',18)
        if(!sessionStorage.tos)
        {
            $('.ui.tos.modal').remove()
            $('article').append(Blaze.toHTMLWithData(Template.tosmodal, { project: this }));
            $('.ui.tos.modal').modal('setting', 'transition', 'scale').modal('show')
        }
    }
});

FlowRouter.route('/admin', {
    name: 'admin',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "admin", topmenu: "topmenu" });
    }
});

FlowRouter.route('/faq', {
    name: 'faq',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "faq", topmenu: "topmenu" });
    }
});

FlowRouter.route('/tos', {
    name: 'tos',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "tos", topmenu: "topmenu" });
    }
});

FlowRouter.route('/aboutus', {
    name: 'aboutus',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "aboutus", topmenu: "topmenu" });
    }
});

FlowRouter.route('/create', {
    name: 'create',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "create", topmenu: "topmenu" });
    }
});


FlowRouter.route('/login', {
    name: 'login',
    action: function (params, queryParams) {
        localStorage.clear();
        localStorage.setItem('accesstoken', queryParams.access_token)
        localStorage.setItem('expireat', queryParams.expire_at)
        localStorage.setItem('username', queryParams.username)
        //console.log(queryParams.access_token)
        var time = new Date();
        FlowRouter.setQueryParams({ params: null, queryParams: null });
        time = new Date(time.getTime() + 1000 * (localStorage.expireat - 10000));
        localStorage.setItem('expirein', time)
        FlowRouter.go('/')
    }
});


FlowRouter.route('/@:user', {
    name: 'profile',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "profile", topmenu: "topmenu" });
        Session.set('user', params.user)
        Session.set('currentprofiletab','blog')
        User.add(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        if(!PersonalHistory.findOne({author:params.user}))
        PersonalHistory.getPersonalHistory(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        Followers.loadFollowers(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        $('.menu.profile .item').tab('change tab', 'first')
    }
});

FlowRouter.route('/@:user/comments', {
    name: 'profile',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "profile", topmenu: "topmenu" });
        Session.set('user', params.user)
        Session.set('currentprofiletab','comments')
        User.add(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        if(!PersonalHistory.findOne({author:params.user}))
        PersonalHistory.getPersonalHistory(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        Followers.loadFollowers(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        $('.menu.profile .item').tab('change tab', 'second')
    }
});

FlowRouter.route('/@:user/replies', {
    name: 'profile',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "profile", topmenu: "topmenu" });
        Session.set('user', params.user)
        Session.set('currentprofiletab','replies')
        User.add(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        if(!PersonalHistory.findOne({author:params.user}))
        PersonalHistory.getPersonalHistory(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        Followers.loadFollowers(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        $('.menu.profile .item').tab('change tab', 'third')
    }
});

FlowRouter.route('/@:user/rewards', {
    name: 'profile',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "profile", topmenu: "topmenu" });
        Session.set('user', params.user)
        Session.set('currentprofiletab','rewards')
        User.add(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        if(!PersonalHistory.findOne({author:params.user}))
        PersonalHistory.getPersonalHistory(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        Followers.loadFollowers(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        $('.menu.profile .item').tab('change tab', 'fourth')
    }
});

FlowRouter.route('/@:user/wallet', {
    name: 'profile',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "profile", topmenu: "topmenu" });
        Session.set('user', params.user)
        Session.set('currentprofiletab','wallet')
        User.add(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        if(!PersonalHistory.findOne({author:params.user}))
        PersonalHistory.getPersonalHistory(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        Followers.loadFollowers(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        $('.menu.profile .item').tab('change tab', 'fifth')
    }
});

FlowRouter.route('/:tag', {
    name: 'create',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "home", topmenu: "topmenu" });
        Session.set('currentSearch',params.tag)
        Session.set('isonreply', false)
        Session.set('visiblecontent',18)
    }
});




FlowRouter.route('/@:user/:permlink', {
    name: 'project',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "article", topmenu: "topmenu" });
        Session.set('isonreply', true)
        Session.set('user', params.user)
        Session.set('article', params.permlink)
        if (!Content.findOne({ permlink: params.permlink })) {
            Content.getContent(params.user, params.permlink, function (error) {
                if (error) {
                    console.log(error)
                }
            })
        }
        // if (!Comments.findOne({ permlink: params.permlink })) {
        //     Comments.loadComments(params.user, params.permlink, function (error) {
        //         if (error) {
        //             console.log(error)
        //         }
        //     })
        // }
        User.add(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        Blog.getContentByBlog(params.user, 20, 'blog', function (error) {
            if (error) {
                console.log(error)
            }
        })
        window.scrollTo(0,0)
        Followers.loadFollowers(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
    }
})



//TO FIX PROBLEM WITH SEARCH 
FlowRouter.route('//@:user/:permlink', {
    name: 'project',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "article", topmenu: "topmenu" });
        Session.set('isonreply', true)
        Session.set('user', params.user)
        Session.set('article', params.permlink)
        if (!Content.findOne({ permlink: params.permlink })) {
            Content.getContent(params.user, params.permlink, function (error) {
                if (error) {
                    console.log(error)
                }
            })
        }
        if (!Comments.findOne({ permlink: params.permlink })) {
            Comments.loadComments(params.user, params.permlink, function (error) {
                if (error) {
                    console.log(error)
                }
            })
        }
        User.add(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        PersonalHistory.getPersonalHistory(params.user, function (error) {
            if (error) {
                console.log(error)
            }
        })
        Blog.getContentByBlog(params.user, 20, 'blog', function (error) {
            if (error) {
                console.log(error)
            }
        })

        // Content.getContentByAuthor(params.user, "", function (error) {
        //     if (error) {
        //         console.log(error)
        //     }
        // })
    }
});

FlowRouter.route('/:tag/@:user/:permlink', {
    name: 'project',
    action: function (params, queryParams) {
        BlazeLayout.render('mainlayout', { sidebar: "sidebar", main: "article", topmenu: "topmenu" });
        FlowRouter.setQueryParams({ params: null, queryParams: null });
        FlowRouter.go('/')
        FlowRouter.go('/@' + params.user + '/' + params.permlink)
        Session.set('user', params.user)
        Session.set('article', params.permlink)
    }
});






