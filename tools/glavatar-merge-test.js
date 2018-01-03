const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const fs = require('fs');


// temp
var skeletonGltfPath = 'demo/models/saber-body-walk/';
var skeletonGltfFilename = 'saber-body-walk.gltf';
var accessoryGltfPath = 'demo/models/saber-maid-hair/';
var accessoryGltfFilename = 'saber-maid-hair.gltf';


var skeleton = JSON.parse(fs.readFileSync(skeletonGltfPath + skeletonGltfFilename));
var accessory = JSON.parse(fs.readFileSync(accessoryGltfPath + accessoryGltfFilename));


/**
 * 
 * @param {*} skeleton gltf json
 * @param {*} skin gltf json
 */
function merge(skeleton, skin) {
    var i, len, j, lenj;


    // buffers
    var bufferBaseId = skeleton.buffers.length;
    // for (i = 0, len = skin.buffers.length; i < len; i++) {
    //     skeleton.buffers.push(skin.buffers[i]);
    // }
    skeleton.buffers = skeleton.buffers.concat(skin.buffers);


    // bufferViews
    var bufferViewBaseId = skeleton.bufferViews.length;
    for (i = 0, len = skin.bufferViews.length; i < len; i++) {
        skeleton.bufferViews.push(skin.bufferViews[i]);
        skeleton.bufferViews[i + bufferViewBaseId].buffer += bufferBaseId;
    }

    // accessors
    var accessorBaseId = skeleton.accessors.length;
    for (i = 0, len = skin.accessors.length; i < len; i++) {
        skeleton.accessors.push(skin.accessors[i]);
        skeleton.accessors[i + accessorBaseId].bufferView += bufferViewBaseId;
    }


    // images
    var imageBaseId = skeleton.images.length;
    skeleton.images = skeleton.images.concat(skin.images);

    // samplers
    var samplerBaseId = skeleton.samplers.length;
    skeleton.samplers = skeleton.samplers.concat(skin.samplers);

    // textures
    var textureBaseId = skeleton.textures.length;
    skeleton.textures = skeleton.textures.concat(skin.textures);
    for (i = 0, len = skin.textures.length; i < len; i++) {
        var t = skeleton.textures[i + textureBaseId];
        if (t.sampler !== undefined) {
            t.sampler += samplerBaseId;
        }
        if (t.source !== undefined) {
            t.source += imageBaseId;
        }
    }

    // materials
    var materialBaseId = skeleton.materials.length;
    for (i = 0, len = skin.materials.length; i < len; i++) {
        skeleton.materials.push(skin.materials[i]);
        var m = skeleton.materials[i + materialBaseId];
        if (m.pbrMetallicRoughness !== undefined) {
            if (m.pbrMetallicRoughness.baseColorTexture !== undefined) {
                var bt = m.pbrMetallicRoughness.baseColorTexture;
                for (var tt in bt) {
                    bt[tt] += imageBaseId;
                }
            }
        }
    }

    // meshes
    var meshBaseId = skeleton.meshes.length;
    for (i = 0, len = skin.meshes.length; i < len; i++) {
        skeleton.meshes.push(skin.meshes[i]);
        var m = skeleton.meshes[i + meshBaseId];
        if (m.primitives !== undefined) {
            var p = m.primitives;
            if (p.indices !== undefined) {
                p.indices += accessorBaseId;
            }

            if (p.material !== undefined) {
                p.material += materialBaseId;
            }

            if (p.attributes) {
                var a = p.attributes;
                for (var att in a) {
                    a[att] += accessorBaseId;
                }
            }

            if (p.extensions) {
                if (p.extensions.gl_avatar.attributes) {
                    var ea = p.extensions.gl_avatar.attributes;
                    if (!p.attributes) {
                        p.attributes = {};
                    }
                    for (var att2 in ea) {
                        p.attributes[att2] = ea[att2] + accessorBaseId;
                    }
                }
            }
        }
    }

    // nodes
    var nodeBaseId = skeleton.meshes.length;
    for (i = 0, len = skin.nodes.length; i < len; i++) {
        skeleton.nodes.push(skin.nodes[i]);
        var n = skeleton.nodes[i + nodeBaseId];
        if (n.children !== undefined) {
            var c = n.children;
            for (j = 0, lenj = c.length; j < lenj; j++) {
                c[j] += nodeBaseId;
            }

            if (n.mesh != undefined) {
                n.mesh += meshBaseId;
            }

            // skins link
            if (n.extensions) {
                // create a new skin copy of skin linked
                // replace inverseBindMatrices
                if (n.extensions.gl_avatar) {
                    n.skin = Object.assign({}, skeleton.extensions.gl_avatar.skins[n.extensions.gl_avatar.skin.name]);
                    n.skin = n.extensions.gl_avatar.skin.inverseBindMatrices;
                }

                n.extensions = null;
            }
        }
    }

    // scenes (assume only one scene)
    var sceneNodeBaseId = skeleton.scenes[0].nodes.length;
    skeleton.scenes[0].nodes = skeleton.scenes[0].nodes.concat(skin.scenes[0].nodes);
    for (i = 0, len = skin.scenes[0].nodes.length; i < len; i++) {
        skeleton.scenes[0].nodes[i + sceneNodeBaseId] += nodeBaseId;
    }

    


}


merge(skeleton, accessory);



var outputFilename = 'models/merged/output.gltf';

fs.writeFileSync(outputFilename, JSON.stringify(skeleton));