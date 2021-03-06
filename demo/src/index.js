


import {glAvatarSystem} from './gl-avatar-system.js';
import GUI from 'dat.gui';
import '../css/style.css';



var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);


// ------------------------------------------------
//                     GUI
// ------------------------------------------------

var selectAccessory = glAvatarSystem.selectAccessory;
var selectSkeleton = glAvatarSystem.selectSkeleton;

var gui = new GUI.GUI();
var glAvatarControl = function() {

    this.curAnimation = 0;
    this.animations = {};
    this.animationList = null;

    // this.VC = function() {
    //     console.log("load VC");
    //     // glTFLoader.loadGLTF("https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf"
    //     glTFLoader.loadGLTF("https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/VC/glTF/VC.gltf"
    //         , setupScene
    //     )
    // };
    
    this.onChangeSkeleton = function(gltf) {
        this.animations = {};
        if (gltf.animations) {
            for (var i = 0, len = gltf.animations.length; i < len; i++) {
                this.animations[gltf.animations[i].name || i] = i;
            }
        }
        if (this.animationList) {
            gui.remove(this.animationList);
        }
        this.animationList = gui.add(this, 'curAnimation', this.animations);
        this.animationList.onChange(glAvatarSystem.selectAnimation.bind(glAvatarSystem));
    };


    this.patrick = function() {
        selectSkeleton(
            'patrick'
            , 'models/patrick_no_shirt/patrick-no-shirt.gltf'
            , this.onChangeSkeleton.bind(this)
        );

        // TODO: change dat.gui accessories
    };

    this.saber = function() {
        selectSkeleton(
            'saber'
            , 'models/saber-body/saber-body.gltf'
            // , 'models/saber-body-old-test/saber-body.gltf'
            , this.onChangeSkeleton.bind(this)
        );

        // TODO: change dat.gui accessories
    };

    this.saber_mixamo = function() {
        selectSkeleton(
            'saber_mixamo'
            , 'models/saber-mixamo-animation-test/saber-animation.gltf'
            , this.onChangeSkeleton.bind(this)
        );


        // TODO: fix minimal gltf loader 
        // get TRS from matrix
        





        // TODO: change dat.gui accessories
    };





    this.gltfShirt = function() {
        selectAccessory(
            'clothes'
            , 'gltfShirt'
            , 'models/gltf_shirt_glavatar_fix/gltf_shirt.gltf');
    };

    this.batman_armor = function() {
        selectAccessory(
            'clothes'
            , 'batman_armor'
            , 'models/batman_armor_glavatar/batman_armor.gltf');
    };

    this.redHair = function() {
        selectAccessory(
            'hair'
            , 'red_hair'
            , 'models/hair_glavatar/hair.gltf');
    };


    // saber accessory ----------------
    this.maidHair = function() {
        selectAccessory(
            'hair'
            , 'maid_hair'
            , 'models/saber-maid-hair/saber-maid-hair.gltf');
    };

    this.lilyHair = function() {
        selectAccessory(
            'hair'
            , 'pony_tail_hair'
            , 'models/saber-lily-hair/saber-lily-hair.gltf');
    };

    this.proHair = function() {
        selectAccessory(
            'hair'
            , 'pro_hair'
            , 'models/saber-pro-hair/saber-pro-hair.gltf');
    };

    this.maidDress = function() {
        selectAccessory(
            'clothes'
            , 'maid_dress'
            , 'models/saber-maid-dress/saber-maid-dress.gltf');
    };

    this.suit = function() {
        selectAccessory(
            'clothes'
            , 'suit'
            , 'models/saber-suit/saber-suit.gltf');
    };


    // -----------------

    this.exportGltf = function() {
        // Utils.exportGltf(glAvatarViewer.scenes.map(function (x) { return x.gltf; }));
    };
};
var avatarControl = new glAvatarControl();


var folderScene = gui.addFolder('scene');
// folderScene.add(avatarControl, 'VC');




var folderSkeleton = gui.addFolder('skeletons');
// folderSkeleton.add(avatarControl, 'patrick');
folderSkeleton.add(avatarControl, 'saber');
folderSkeleton.add(avatarControl, 'saber_mixamo');



var folderHair = gui.addFolder('hair');
// folderHair.add(avatarControl, 'redHair');
folderHair.add(avatarControl, 'maidHair');
folderHair.add(avatarControl, 'lilyHair');
folderHair.add(avatarControl, 'proHair');

var folderClothes = gui.addFolder('clothes');
// folderClothes.add(avatarControl, 'gltfShirt');
// folderClothes.add(avatarControl, 'batman_armor');
folderClothes.add(avatarControl, 'maidDress');
folderClothes.add(avatarControl, 'suit');

gui.add(avatarControl, 'exportGltf');




// var animationList = gui.add(avatarControl, 'animations', {});
// animationList.onChange(function(s){
//     glAvatarSystem.selectAnimation(s);
// });






glAvatarSystem.onload = avatarControl.onChangeSkeleton.bind(avatarControl);
glAvatarSystem.init(canvas);
// glAvatarSystem.render();
