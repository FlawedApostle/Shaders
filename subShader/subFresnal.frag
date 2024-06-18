#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(location = 0) out vec4 fragColor;

layout(location = 3) in vec3 vertNormal;
layout(location = 4) in vec3 eyeDir;
//layout(location = 2) in vec2 textureCoords; 
in mat3 normalMatrix;
in vec3 Normal;
in vec3 Position;

/// Uniforms
uniform sampler2D myTexture; 
uniform samplerCube skybox;
uniform vec3 cameraPos;

uniform vec4 lightOne;
uniform vec4 lightTwo;
uniform vec4 kdColor1;
uniform vec4 kdColor2;


void main() {



    vec3 I = normalize(Position - eyeDir);
    vec3 R = reflect(I , normalize(Normal));

    fragColor = vec4(texture(skybox, R).rgb, 1.0f);
}