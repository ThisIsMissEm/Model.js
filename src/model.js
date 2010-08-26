;(function(root){
  var previousModel = root.Model;
  
  // Quick access to prototype methods
  var hasOwnProperty = Object.prototype.hasOwnProperty
    , nativeForEach = Array.prototype.forEach;

  // Establish the object that gets thrown to break out of a loop iteration.
  var breaker = typeof StopIteration !== 'undefined' ? StopIteration : '__break__'
    , counter = 0;
  
  /*-----------------------------------------------
    Utilities
  -----------------------------------------------*/
  var breakLoop = function(){
    throw breaker;
  };
  
  var each = function(obj, iterator, context){
    try {
      if(nativeForEach && obj.forEach === nativeForEach){
        obj.forEach(iterator, context);
      } else {
        for(var key in obj) if(hasOwnProperty.call(obj, key)){
          iterator.call(context, obj[key], key, obj);
        }
      }
    } catch(e){
      if(e != breaker) throw e;
    }
    return obj;
  };

  var mixin = function(target){
    var args = Array.prototype.slice.call(arguments, 1);
    
    each(args, function(source){
      for(var prop in source) if(hasOwnProperty.call(source, prop)){
        target[prop] = source[prop];
      }
    });
    
    return target;
  };
  
  /*-----------------------------------------------
    ObjectId type
  -----------------------------------------------*/
  function ObjectId(){
    return ""+(+new Date)+(++counter);
  };
  
  
  /*-----------------------------------------------
    Core
  -----------------------------------------------*/
  var Model;
  root.Model = Model = {};
  
  Model.VERSION = "0.0.2";
  
  Model.models = {};
  Model.declareGlobal = true;
  
  Model.noConflict = function(){
    root.Model = previousModel;
    return this;
  };
  
  Model.declare = function(name, initializer) {
    Model.models[name] = new Model.Class(initializer);
    root[name] = Model.models[name].instance;
  };
  
  Model.Class = function( initializer ){
    this._defaultAttributes = {};
    this._validations = {};
    this._collection = [];
    this.instance = new ModelInstance(this);
    
    mixin(this, Model.ClassMethods)
    mixin(this.instance, this);
//    mixin(this.instance, Model.Query);
    
    initializer.call(this);
//    mixin(this.instance.prototype, ModelInstance.prototype);
  };
  
  Model.ClassMethods = {
    key: function( name, options ){
      this._defaultAttributes[name] = null;
    },
    
    hasMany: function(){},
    hasOne: function(){},
    belongsTo: function(){},
  };
  
  /*-----------------------------------------------
    Model Instance Setup & Methods
  -----------------------------------------------*/
  var ModelInstance = function( ModelClass ){
    var instance =  function( attributes ){
      // saved attributes:
      this.__attributes = {};
      // unsaved attributes:
      this.__dirtyAttributes = mixin({
        "_id": ObjectId()
      }, ModelClass._defaultAttributes);
    
      // Update empty model based on initial attributes:
      mixin(this.__dirtyAttributes, attributes);
      
      ModelClass._collection.push(this);
    };
    
    mixin(instance, Model.Query);
    mixin(instance.prototype, ModelInstance.prototype);
    
    return instance;
  };
  
  mixin(ModelInstance.prototype, {
    new_record: false,
    dirty: false,
    
    save: function(){
      
      
    },
    update: function(){
      
      
    }
  });
  
  
  
  Model.Query = {
    all: function(){
      return this._collection;
    }
  };
  
  // Create a safe instance of Model
  // root.Model = function Model( fields ) {
  //   var model = ModelInstance;
  //   
  //   mixin(model, Model.prototype);
  //   mixin(model.prototype, ModelInstance.prototype);
  //   
  //   model.__fields = mixin({_id: ObjectId}, fields);
  //   // model.__validations = {};
  //   model.__collection = [];
  //   model.__events = Model.events;
  //   
  //   // each(model.__fields, function(type, key){
  //   //   model.__validations[key] = model.__validations[key] || [];
  //   //   model.__validations[key].push(function(value){
  //   //     return typeof(value) == typeof(type());
  //   //   });
  //   // });
  //   
  //   if(model.__events["create"]){
  //     each(model.__events["create"], function(callback){
  //       callback.call(model);
  //     });
  //   }
  //   
  //   return model;
  // };
    // 
    // Model.VERSION = '0.0.1';
    // 
  
    // 
    // Model.extend = function( methods ) {
    //   mixin(Model.prototype, methods);
    // };
    // 
    // Model.extendInstance = function( methods ){
    //   mixin(ModelInstance.prototype, methods);
    // };
    // 
    // Model.plugins = {};
    // Model.plugin = function( name, methods ){
    //   Model.plugins[name] = methods;
    // };
    // 
    // Model.use = function( name ) {
    //   var methods = Model.plugins[name];
    //   if(methods["init"]){
    //     this.__events["create"] = this.__events["create"] || [];
    //     this.__events["create"].push(methods["init"]);
    //   }
    //   if(methods["classMethods"]) {
    //     this.extend(methods["classMethods"]);
    //   }
    //   if(methods["instanceMethods"]) {
    //     this.extendInstance(methods["instanceMethods"]);
    //   }
    // };
    // 
    // Model.extend({
    //   all: function(){
    //     return this.__collection;
    //   },
    //   
    //   each: function(iterator) {
    //     each(this.__collection, function(item) {
    //       iterator.call(this, item.__attributes, item);
    //     }, this);
    //     return this;
    //   },
    //   
    //   find: function( key, value ) {
    //     var result = [];
    //     this.each(function(attrs, item) {
    //       if(attrs[key] === value) {
    //         result.push(item);
    //       }
    //     });
    //     return result;
    //   },
    //   
    //   findOne: function( key, value ) {
    //     var result;
    //     this.each(function(attrs, item) {
    //       if(attrs[key] === value) {
    //         result = item;
    //         breakLoop();
    //       }
    //     });
    //     return result;
    //   },
    //   
    //   first: function(key, value) {
    //     var result;
    //     this.each(function(attrs, item) {
    //       if(attrs[key] === value) {
    //         result = item;
    //         breakLoop();
    //       }
    //     });
    //     return result;
    //   },
    //   
    //   last: function(){
    //     var result;
    //     this.each(function(attrs, item) {
    //       if(attrs[key] === value) {
    //         result = item;
    //       }
    //     });
    //     return result;
    //   }
    // });
    // 
    // 
    // Model.extendInstance({
    //   new_record: true,
    //   dirty: false,
    //   
    //   _save: function(attrs){
    //     mixin(this.__attributes, this.__dirtyAttributes, attrs || {});
    //     this.__dirtyAttributes = {};
    //     this.dirty = false;
    //     
    //     if(this.new_record){
    //       this.constructor.__collection.push(this);
    //     }
    //     
    //     return this;
    //   },
    //   
    //   update: function(updated_attrs) {
    //     return this._save(updated_attrs);
    //   },
    //   
    //   save: function() {
    //     return this._save();
    //   },
    //   
    //   attr: function(key, value) {
    //     if(value !== undefined){
    //       this.__dirtyAttributes[key] = value;
    //       this.dirty = true;
    //       return this;
    //     } else {
    //       return this.__dirtyAttributes[key] || this.__attributes[key] || undefined;
    //     }
    //   }
    // });
    // 
    // Model.extendInstance({
    //   errors: [],
    //   
    //   validate: function(){
    //     var modelClass = this.constructor
    //       , modelInstance = this;
    //     
    //     modelInstance.errors = [];
    //     
    //     each(modelClass.__validations, function(validators, key){
    //       var value = modelInstance.__dirtyAttributes[key];
    //       each(validators, function(validator){
    //         var error = validator.call(modelInstance, value);
    //         if( ! error ){
    //           modelInstance.errors.push(key+" not valid");
    //         }
    //       });
    //     });
    //     
    //     return modelInstance.errors.length == 0;
    //   }
    // });
  
  
  // Model.plugin("relations", {
  //   initializer: function(){
  //     this.prototype.__attr = new Function(this.prototype.attr.toString());
  //   },
  //   instanceMethods: {
  //     __associations: {},
  //         
  //     attr: function(key, value){
  //       if(key in this.__associations){
  //         return false;
  //       } else {
  //         return this.__attr(key, value);
  //       }
  //     }
  //   }
  // });
  // 
  // Model.use("relations");
  
  // Model.plugin("test", {
  //   initializer: function(){
  //     console.log("foo");
  //   }
  // });
  
//  Model.use("test");
})(this);