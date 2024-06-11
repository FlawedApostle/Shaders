#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(location = 0) in vec4 inVertex;
out vec3 TexCoords;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;


void main() 
{
    TexCoords = vec3(inVertex);
    gl_Position = projectionMatrix * viewMatrix *  vec4(inVertex);
//    vec4 pos = projectionMatrix * viewMatrix * vec4(inVertex);
//    gl_Position = pos.xyww;
//    gl_Position = projectionMatrix * viewMatrix *  vec4(inVertex);
    
}
