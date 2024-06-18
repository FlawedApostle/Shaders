#version 450
#extension GL_ARB_separate_shader_objects : enable
//layout(location = 0)  in vec4 vPos;
layout(location = 0)  in vec3 vPos;
layout(location = 1)  in vec3 vNormal;
layout(location = 2)  in vec2 uvCoord;

layout(location = 3) out vec3 vertNormal;
layout(location = 4) out vec3 eyeDir;
out mat3 normalMatrix;
out vec3 Normal;
out vec3 Position;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

void main()
{
    
    Normal = mat3(transpose(inverse(modelMatrix))) * vNormal;                         // get model matrix normal
    vertNormal = normalize(Normal * vNormal);

    vec3 vertPos = vec3(viewMatrix * modelMatrix * vec4(vPos,1.0f));
    vec3 vertDir = normalize(vertPos);
    eyeDir = -vertPos;

    Position = vec3(modelMatrix * vec4(vPos,1.0f));
    
    gl_Position = projectionMatrix * viewMatrix *  vec4(Position, 1.0f);

 

//    Position = vec3(modelMatrix * vec4(vPos,1.0f));                                   // Position is used to calculate view direction in frag shader
//    vec3 normalDir = normalize(Position);                                             // normalize the Position --> done in frag shader
//    eyeDir = vec3(viewMatrix * modelMatrix * vec4(vPos,1.0f));                        // eypos, direction related to view , model
//    vec3 normalEyeDir = normalize(eyeDir);                                            // normalize eye direction
//    eyeDir = -normalDir;                                                              // inverse for viewing 
   


//    normalMatrix = mat3(transpose(inverse(modelMatrix)));                          // get model matrix normal
//    vertNormal = normalize(normalMatrix * vNormal);                                // Rotate the normal to the correct orientation 
//    vec3 vertPos = vec3(viewMatrix * modelMatrix * vec4(vPos,1.0f));               // eypos, direction related to view , model
//    Normal = mat3(transpose(inverse(modelMatrix))) * vNormal;
//    Position = vec3(modelMatrix * vec4(vPos, 1.0f));
//    gl_Position = projectionMatrix * viewMatrix * modelMatrix *  vec4(vPos, 1.0f);

}


