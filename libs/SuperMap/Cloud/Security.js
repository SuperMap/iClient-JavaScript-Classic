/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/


/**
 * @requires SuperMap/Cloud.js
 */

/**
 * Class: SuperMap.Cloud.Security
 * iportal或者isupermap的登录注册类
 */
SuperMap.Cloud.Security=SuperMap.Class({
    /**
     * Property: url
     * 登录地址
     * */
    url:null,

    /**
     * APIProperty: type
     * {Number} 登录注册的服务器类型，可为SuperMap.Cloud.Security.SUPERMAPOL或者SuperMap.Cloud.Security.IPORTAL,
     * 默认为SuperMap.Cloud.Security.SUPERMAPOL
     * */
    type:null,

    /**
     * Property: actived
     * {Boolean} 状态位，用判断此对象是否已失效，是的话就阻止回调函数进行回调
     * */
    actived:null,

    /**
     * Constructor: SuperMap.Cloud.Security
     * 登录注册服务类
     *
     * Examples:
     * isupermap登录：
     * (start code)
     *  var type=SuperMap.Cloud.Security.SUPERMAPOL;
     *  var security=new SuperMap.Cloud.Security(type);
     * (end)
     *  iportal登录：
     * (start code)
     *   var type=SuperMap.Cloud.Security.IPORTAL;
     *   var url="http://localhost:8092/iportal";
     *   var security=new SuperMap.Cloud.Security(type,url);
     * (end)
     * */
    initialize:function(type,url){
        if(!type){
            this.type=SuperMap.Cloud.Security.SUPERMAPOL;
        }else{
            this.setType(type);
        }
        this.setUrl(url);
        this.actived=true;
    },

    /**
     * APIMethod: destroy
     * 销毁登录注册对象
     * */
    destroy:function(){
        this.url=null;
        this.type=null;
        this.actived=null;
    },

    /**
     * APIMethod: setType
     * 设置登录类型，可为SuperMap.Cloud.Security.SUPERMAPOL或者SuperMap.Cloud.Security.IPORTAL
     * */
    setType:function(type){
        this.type=type;
    },

    /**
     * APIMethod: setUrl
     * 设置url
     * */
    setUrl:function(url){
        if(!url){
            return;
        }
        var end = url.substr(url.length - 1, 1);
        this.url=url+(end==="/"?"web/":"/web/");
    },

    /**
     * APIMethod: login
     * 登录
     *
     * Parameters:
     * username - {String} （iportal登录用）用户名
     * password - {String} （iportal登录用）密码
     * success - {Function} （iportal登录用）成功回调函数
     * failed - {Function} （iportal登录用）失败回调函数
     * scope - {Object} iportal登录用）[可选]回调函数的作用域
     * */
    login:function(){
        var success,failed,scope;
        if(this.type===SuperMap.Cloud.Security.IPROTAL){
            if(arguments.length>=4){
                var username=arguments[0],
                    password=arguments[1];
                success=typeof arguments[2]==="function"?arguments[2]:function(){};
                failed=typeof arguments[2]==="function"?arguments[3]:function(){};
                scope=arguments[4]||null;
                var loginInfo={username:username,password:password};
                return this.iportalLogin(loginInfo,success,failed,scope);
            }
        }else if(this.type===SuperMap.Cloud.Security.SUPERMAPOL){
            if(arguments.length<=1){
                var url=arguments[0];
                return this.isupermapLogin(url);
            }
        }
        return this;
    },

    /**
     * APIMethod: logout
     * 登出
     *
     * Parameters:
     * success - {Function} 成功回调函数
     * failed - {Function} 失败回调函数
     * scope - {Object} [可选]回调函数的作用域
     * */
    logout:function(){
        var success,failed,scope;
        if(this.type===SuperMap.Cloud.Security.IPROTAL){
            if(arguments.length>=1){
                success=typeof arguments[0]==="function"?arguments[0]:function(){};
                failed=typeof arguments[1]==="function"?arguments[1]:function(){};
                scope=arguments[2]||null;
                return this.iportalLogout(success,failed,scope);
            }
        }else if(this.type===SuperMap.Cloud.Security.SUPERMAPOL){
            //
        }
        return this;
    },

    /**
     * APIMethod: registerUser
     * 注册用户
     *
     * Parameters:
     * username - {String} （iportal注册用）用户名
     * nickname - {String} （iportal注册用）用户昵称
     * password - {String} （iportal注册用）密码
     * email - {String} iportal注册用）用户的email地址
     * success - {Function} （iportal注册用）成功回调函数
     * failed - {Function} （iportal注册用）失败回调函数
     * scope - {Object} iportal注册用）[可选]回调函数的作用域
     * */
    registerUser:function(){
        if(this.type===SuperMap.Cloud.Security.IPROTAL){
            if(arguments.length>=6){
                var name=arguments[0],
                    nickname=arguments[1],
                    password=arguments[2],
                    email=arguments[3],
                    success=typeof arguments[4]==="function"?arguments[4]:function(){},
                    failed=typeof arguments[5]==="function"?arguments[5]:function(){},
                    scope=arguments[6]||null;
                var registerInfo={name:name,nickname:nickname,password:password,email:email};
                return this.iportalRegisterUser(registerInfo,success,failed,scope);
            }
        }else if(this.type===SuperMap.Cloud.Security.SUPERMAPOL){
            if(arguments.length<=1){
                var url=arguments[0];
                return this.isupermapRegisterUser(url);
            }
        }
        return this;
    },

    /**
     * APIMethod: isLogin
     * 检查用户是否已经登录
     *
     * Parameters:
     * success - {Function} 成功回调函数
     * failed - {Function} 失败回调函数
     * scope - {Object} [可选]回调函数的作用域
     * */
    isLogin: function(){
        if(this.type===SuperMap.Cloud.Security.IPROTAL){
            var success=typeof arguments[0]==="function"?arguments[0]:function(){},
                failed=typeof arguments[1]==="function"?arguments[1]:function(){},
                scope=arguments[2]||null;
            return this.iportalIsLogin(success,failed,scope);
        }else if(this.type===SuperMap.Cloud.Security.SUPERMAPOL){
            /*do nothing*/
        }
        return this;
    },

    /**
     * APIMethod: getUserInfo
     * iportal获取用户信息的方法
     *
     * Parameters:
     * username - {String} 用户名
     * success - {Function} 成功回调函数
     * failed - {Function} 失败回调函数
     * scope - {Object} [可选]回调函数的作用域
     * */
    getUserInfo:function(){
        if(this.type===SuperMap.Cloud.Security.IPROTAL){
            if(arguments.length>=3){
                var username=arguments[0],
                    success=typeof arguments[1]==="function"?arguments[1]:function(){},
                    failed=typeof arguments[2]==="function"?arguments[2]:function(){},
                    scope=arguments[3]||null;
                return this.iportalGetUserInfo(username,success,failed,scope);
            }
        }else if(this.type===SuperMap.Cloud.Security.SUPERMAPOL){
            /*do nothing*/
        }
        return this;
    },

    iportalLogin:function(loginInfo,success,failed,scope){
        var url=this.url+"login.json";
        var that=this;
        loginInfo=SuperMap.Util.toJSON(loginInfo);
        SuperMap.Request.issue({
            url:url,
            data:loginInfo,
            headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            method:"POST",
            withCredentials:true,
            success:function(result){
                result = new SuperMap.Format.JSON().read(result.responseText);
                if(!that.actived){
                    return;
                }else if(!result && typeof failed==="function"){
                    failed.call(scope||this,result);
                    return;
                }
                if(result.succeed){
                    if(typeof success==="function"){
                        success.call(scope||this,result);
                    }
                }else{
                    if(typeof failed==="function"){
                        failed.call(scope||this,result);
                    }
                }
            },
            failure:function(err){
                if(!that.actived){
                    return;
                }
                if(typeof failed==="function"){
                    failed.call(scope||this,err);
                }
            },
            scope:this
        });
        return this;
    },

    iportalLogout:function(success,failed,scope){
        var url=this.url+"../services/security/logout";
        var that=this;
        var request = SuperMap.Request.issue({
            url:url,
            headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            method:"GET",
            withCredentials:true,
            success:function(){
                if(!that.actived){
                    return;
                }
                if(request.status === 0 && typeof success==="function"){
                    success.call(scope||this);
                }else if(typeof failed==="function"){
                    failed.call(scope||this);
                }
            },
            failure:function(err){
                if(!that.actived){
                    return;
                }
                if(typeof failed==="function"){
                    failed.call(scope||this,err);
                }
            },
            scope:this
        });
        return this;
    },

    iportalIsLogin: function(success,failed,scope){
        var url=this.url+"mycontent/account.json";
        var that=this;
        SuperMap.Request.issue({
            url:url,
            headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            method:"GET",
            withCredentials:true,
            success:function(result){
                result = new SuperMap.Format.JSON().read(result.responseText);
                if(!that.actived){
                    return;
                }else if(!result && typeof failed==="function"){
                    failed.call(scope||this,result);
                    return;
                }
                if(result.name !== 'anonym'){
                    if(typeof success==="function"){
                        success.call(scope||this,result);
                    }
                }else{
                    if(typeof failed==="function"){
                        failed.call(scope||this,result);
                    }
                }
            },
            failure:function(err){
                if(!that.actived){
                    return;
                }
                if(typeof failed==="function"){
                    failed.call(scope||this,err);
                }
            },
            scope:this
        });
        return this;
    },

    iportalRegisterUser:function(registerInfo,success,failed,scope){
        var url=this.url+"users.json";
        var that=this;
        registerInfo=SuperMap.Util.toJSON(registerInfo);
        SuperMap.Request.issue({
            url:url,
            data:registerInfo,
            headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
            method:"POST",
            withCredentials:true,
            success:function(result){
                result = new SuperMap.Format.JSON().read(result.responseText);
                if(!result||!that.actived){
                    return;
                }
                if(result.succeed){
                    if(typeof success==="function"){
                        success.call(scope||this,result);
                    }
                }else{
                    if(typeof failed==="function"){
                        failed.call(scope||this,result);
                    }
                }
            },
            failure:function(err){
                if(!that.actived){
                    return;
                }
                if(typeof failed==="function"){
                    failed.call(scope||this,err);
                }
            },
            scope:this
        });
        return this;
    },

    iportalGetUserInfo:function(username,success,failed,scope){
        var url=this.url+"users/{username}.json";
        url=url.replace(/\{username\}/,username);
        var that=this;
        SuperMap.Request.issue({
            url:url,
            method:"GET",
            success:function(result){
                result = new SuperMap.Format.JSON().read(result.responseText);
                if(!result||!that.actived){
                    return;
                }
                if(typeof success==="function"){
                    success.call(scope||this,result);
                }
            },
            failure:function(err){
                if(!that.actived){
                    return;
                }
                if(typeof failed==="function"){
                    failed.call(scope||this,err);
                }
            },
            scope:this
        });
        return this;
    },

    isupermapLogin:function(casUrl){
        var url=SuperMap.Cloud.Security.SUPERMAPSSO;
        url+="/login?service="+casUrl;
        window.open(url,"login");
        return this;
    },

    isupermapRegisterUser:function(redirectUrl){
        var url=SuperMap.Cloud.Security.SUPERMAPSSO;
        url+="/register?service="+redirectUrl;
        window.open(url,"register");
        return this;
    },

    isupermapGetUserInfo:function(){},

    CLASS_NAME:"SuperMap.Cloud.Security"
});

SuperMap.Cloud.Security.SUPERMAPOL="supermapol";
SuperMap.Cloud.Security.IPROTAL="iportal";
SuperMap.Cloud.Security.SUPERMAPSSO="https://sso.supermap.com";