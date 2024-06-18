#version 450
#extension GL_ARB_separate_shader_objects : enable



/// Im just curious the diff between the vVertex, and uvCoord. Is Vertex the (x,y) or is it the actual triangle to be rasterized? (3 points to build the obj) 
/// and is the Coords (x,y) and thats why its normalizing to fit inside the modelmatrix , my head hurts..

layout(location = 0) in vec4 vVertex;
layout(location = 1) in vec3 vNormal;
layout(location = 2) in vec2 uvCoord;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 lightPos;
uniform vec3 lightPosition2;
uniform float texCoords;

layout(location = 0) out vec3 vertNormal;
layout(location = 1) out vec3 lightDir;
layout(location = 2) out vec3 eyeDir;
layout(location = 3) out vec2 textureCoords; 
layout(location = 4) out vec3 lightTwoDir; 

//layout(location = 5) out vec3 outColor;         // uniform color , this is vertex shader so why pass it 


void main() {
    textureCoords = uvCoord;            // obj texture
    textureCoords.x = texCoords;
    //textureCoords *= 1.0f;              // scale texture 

    mat3 normalMatrix = mat3(transpose(inverse(modelMatrix)));
    vertNormal = normalize(normalMatrix * vNormal); /// Rotate the normal to the correct orientation 
    vec3 vertPos = vec3(viewMatrix * modelMatrix * vVertex);
    vec3 vertDir = normalize(vertPos);
    eyeDir = -vertDir;
    lightDir = normalize(vec3(lightPos) - vertPos); 
    lightTwoDir = normalize(vec3(lightPosition2) + vertPos); 
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vVertex;
    
}
