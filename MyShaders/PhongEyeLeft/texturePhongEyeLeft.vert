#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(location = 0) in vec4 vVertex;
layout(location = 1) in vec3 vNormal;
layout(location = 2) in vec2 uvCoord;

/// Matrix Uniforms
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
/// Lights
uniform vec3 lightPos;
uniform vec3 lightTwoPos;

/// Phong uniforms
uniform vec4 KAuniform;
uniform vec4 KDuniform;
uniform vec4 KSuniform;

/// Color uniform



layout(location = 0) out vec3 vertNormal;
layout(location = 1) out vec3 lightDir;                     /// light 1
layout(location = 2) out vec3 eyeDir;
layout(location = 3) out vec2 textureCoords; 
layout(location = 4) out vec3 lightTwoDir;                  /// light 2



/// Phong Layouts
///layout(location = 5) out vec4 KA;                           /// Ka , Ks , Kd
///layout(location = 6) out vec4 KD;
///layout(location = 7) out vec4 KS;


void main() {
    
    textureCoords = uvCoord;
    textureCoords.y *= -1.0f; 
    
    mat3 normalMatrix = mat3(transpose(inverse(modelMatrix)));
    vertNormal = normalize(normalMatrix * vNormal); /// Rotate the normal to the correct orientation 
    vec3 vertPos = vec3(viewMatrix * modelMatrix * vVertex);
    vec3 vertDir = normalize(vertPos);
    eyeDir = -vertDir;
 
    /// Normalize for Light Direction for uniform variable lightPos lightTwoPos
    lightDir = normalize(vec3(lightPos) - vertPos); 
    lightTwoDir = normalize(vec3(lightTwoPos) - vertPos); 

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vVertex;

}
