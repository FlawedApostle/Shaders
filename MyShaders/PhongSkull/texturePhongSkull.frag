#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(location = 0) out vec4 fragColor;

/// Bringing in the vertNormal to calculate the lightDirection
layout(location = 0) in vec3 vertNormal;
layout(location = 1) in vec3 lightDir;						// light 1
layout(location = 2) in vec3 eyeDir; 
layout(location = 3) in vec2 textureCoords; 
layout(location = 4) in vec3 lightTwoDir;					// light 2
layout(location = 5) in vec3 lightThreeDir;					// light 3

/// Uniforms
uniform sampler2D myTexture; 
///uniform vec4 UniformKd;										/// change uniform Col of Kd

/// Uniform Layout Kd
///layout(location = 5) in vec4 KdUniform;


/// Phong Layouts
//layout(location = 5) in vec4 KA;                           /// Ka , Ks , Kd
//layout(location = 6) in vec4 KD;
//layout(location = 7) in vec4 KS;




void main() {
	/// Light Source 1 
    vec4 lightSOne_ks = vec4(0.5, 0.5, 0.5, 0.0);
	vec4 lightSOne_kd = vec4(0.4f,0.0f,0.5f,0.0f);
	vec4 lightSOne_ka = 0.2 * lightSOne_kd;														// Multiplying the spec by the users uniform Color
	vec4 lightSOne_kt = texture(myTexture,textureCoords); 

	/// Light Source 2 - Yellow , I made a uniform to change within OnCreate() , but it broke , I Need to go to Scott and ask him about this, please don't forget !!
	vec4 lightSTwo_ks = vec4(0.5, 0.5, 0.5, 0.0);
	vec4 lightSTwo_kd = vec4(0.6f,0.4f,0.4f,0.0f);
	vec4 lightSTwo_ka = 0.9 * lightSTwo_kd;									// Multiplying the spec by the users uniform Color
	vec4 lightSTwo_kt = texture(myTexture,textureCoords); 

	/// Diffuse ,  Finding the dot product between the normal and the lightDirection Ray to find the amount of light cast on obj 
	//float diffLightOne = max(dot(vertNormal, lightDir), 0.0);
	//float diffLightTwo = max(dot(vertNormal, lightTwoDir), 0.0);
	//float diffLightThree = max(dot(vertNormal, lightThreeDir), 0.0);
	//float combineDiffuseLights = diffLightOne + diffLightTwo + diffLightThree;
	
	/// Create a new normal, find the cross between that normal in relation to the two light source direction's
	/// Broken
	/// Create a new normal by finding the cross product
	/// Using the new crossProd Normal , to find the dot product of the two light Direction source
	/// Creating a float and adding both Light Direction Sources in relation to the newly created cross product normal , cross product normalizes so the light sources are always in relation to each other regardless of position
	vec3 crossProdTestCross = cross(lightDir ,lightTwoDir);
	float diffLightOne = max(dot(crossProdTestCross, lightDir), 0.0);
	float diffLightTwo = max(dot(crossProdTestCross, lightTwoDir), 0.0);
	float diffLightThree = max(dot(crossProdTestCross, lightThreeDir), 0.0);
	float combineDiffuseLights = diffLightOne + diffLightTwo + diffLightThree;


	/// Reflection Light1 , Light2 , Taking the vector of the (surface Point) Normal , and normalizing with the lightDirection to find the direction of the reflection ray
	// based incedent which means a vector from the light source not the direction to the light source so flip the sign
	vec3 reflection = normalize(reflect(-lightDir, vertNormal));
    vec3 refLightTwo = normalize(reflect(-lightTwoDir, vertNormal));

	/// Create a new normal in relation to both lightSources
	/// Talking the vec reflection of both light sources and creating a new normal
	/// normalize the normalCross wich is both reflections from LS1 & LS2 (LightSource) in relation to the original vertNormal
	/// Im, curois, cross product is normalized already ? so does that make line 72 arbitrary ? ASK SCOTT ABOUT THIS
	vec3 normalCross = cross(reflection , refLightTwo );
	vec3 normalCrossVertPos = normalize(reflect(-normalCross , vertNormal));



	/// Reflection Specular , How Shiny
	float spec = max(dot(eyeDir, refLightTwo), 0.0);
	spec = pow(spec,25.0);

	/// Taking the combined reflection normal 
	/// Finding the dot product between eyeDir and the new reflection Normal created above
	float combineSpec = max(dot(eyeDir, normalCross), 0.0);				/// normalCrossVertPos
	combineSpec = pow(combineSpec,10.0);

	
	//// up the LighSources playing with the lights, and the formulas yeild different, wacky results !
	vec4 AddLightsOneTwo_Ka = lightSOne_ka + lightSTwo_ka;
	vec4 AddLightsOneTwo_Kd = lightSOne_kd + lightSTwo_kd;
	vec4 AddLightsOneTwo_Ks = lightSOne_ks * lightSTwo_ks;
	vec4 AddLightsOneTwo_Kt = lightSOne_kt * lightSTwo_kt;

	/// When calling fragColor both colors will be multiplied , added , or subtraced. The light sources will contatin a Normal created in relation to each other, and the normal
	/// how many bytes is FragColor
	//fragColor =  (lightSOne_ka + (diffLightOne * lightSOne_kd) + (combineSpec * lightSOne_ks)) * lightSOne_kt;	
	
	/// Test FragColor
	//fragColor =  (lightSTwo_ka + (diffLightTwo * lightSTwo_kd) + (spec * lightSTwo_ks)) * lightSTwo_kt;	
	fragColor =  (AddLightsOneTwo_Ka + (combineDiffuseLights * AddLightsOneTwo_Kd) + (combineSpec * AddLightsOneTwo_Ks)) * AddLightsOneTwo_Kt;	


}