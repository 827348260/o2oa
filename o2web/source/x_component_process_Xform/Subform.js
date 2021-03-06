MWF.xDesktop.requireApp("process.Xform", "$Module", null, false);
MWF.xApplication.process.Xform.Subform = MWF.APPSubform =  new Class({
    Extends: MWF.APP$Module,

    _loadUserInterface: function(){
        this.node.empty();
        this.getSubform(function(){
            if (this.subformData){
                this.loadSubform();
            }
        }.bind(this));
    },
    loadSubform: function(){
        if (this.subformData){
            //this.form.addEvent("postLoad", function(){
                this.node.set("html", this.subformData.html);
                Object.each(this.subformData.json.moduleList, function(module, key){
                    var formKey = key;
                    if (this.form.json.moduleList[key]){
                        formKey = this.json.id+"_"+key;
                        var moduleNode = this.node.getElement("#"+key);
                        if (moduleNode) moduleNode.set("id", formKey);
                        module.id = formKey;
                    }
                    this.form.json.moduleList[formKey] = module;
                }.bind(this));

                var moduleNodes = this.form._getModuleNodes(this.node);
                moduleNodes.each(function(node){
                    if (node.get("MWFtype")!=="form"){
                        var json = this.form._getDomjson(node);
                        var module = this.form._loadModule(json, node);
                        this.form.modules.push(module);
                    }
                }.bind(this));
            //}.bind(this));
        }
    },
    getSubform: function(callback){
        if (this.json.subformType==="script"){
            if (this.json.subformScript.code){
                var formNome = this.form.Macro.exec(this.json.subformScript.code, this);
                if (formNome){
                    var app = (this.form.businessData.work || this.form.businessData.workCompleted).application;
                    MWF.Actions.get("x_processplatform_assemble_surface").getForm(formNome, app, function(json){
                        this.getSubformData(json.data);
                        if (callback) callback();
                    }.bind(this));
                }
            }
        }else{
            if (this.json.subformSelected && this.json.subformSelected!=="none"){
                var app = (this.form.businessData.work || this.form.businessData.workCompleted).application;
                MWF.Actions.get("x_processplatform_assemble_surface").getForm(this.json.subformSelected, app, function(json){
                    this.getSubformData(json.data);
                    if (callback) callback();
                }.bind(this));
            }else{
                if (callback) callback();
            }
        }
    },
    getSubformData: function(data){
        var subformDataStr = null;
        if (this.form.options.mode !== "Mobile"){
            subformDataStr = data.data;
        }else{
            subformDataStr = data.mobileData;
        }
        this.subformData = null;
        if (subformDataStr){
            this.subformData = JSON.decode(MWF.decodeJsonString(subformDataStr));
            this.subformData.updateTime = data.updateTime;
        }
    }
});