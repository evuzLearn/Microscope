Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function () {
        return Meteor.subscribe('posts');
    }
});

Router.route('/', {
    name: 'postsList'
});

Router.route('/submit', {
    name: 'postSubmit'
});

Router.route('/posts/:_id', {
    name: 'postPage',
    data: function() {
        return Posts.findOne(this.params._id);
    }
});

Router.route('/posts/:_id/edit', {
    name: 'postEdit',
    data: function() { return Posts.findOne(this.params._id); }
});

var requireLogin = function() {
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
};

var requireOwnPost = function () {
    var ownerPost = Posts.findOne(this.params._id).userId;
    if (ownerPost === Meteor.userId()) {
        this.next();
    } else {
        this.render('accessDenied');
    }
};

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
Router.onBeforeAction(requireOwnPost, {only: 'postEdit'});