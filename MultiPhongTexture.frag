#version 450
#extension GL_ARB_separate_shader_objects : enable
/// Defining same layout can be done, but cannot be read at same time duh ! 
/// Dynamically calling fragColor and VertNormal when needed 
/// Defining fragColor to frag shader, there must always be a fragColor
layout(location = 0) out vec4 fragColor;

/// Layouts match with vertex shader, each of these are set inside Vert shader so both shader(s) are talking to each other, via specified layouts ?
/// vertNormal is dynamically called, shaderd with the vert & frag shader via layout 0
layout(location = 0) in vec3 vertNormal;
layout(location = 1) in vec3 lightDir;
layout(location = 2) in vec3 eyeDir; 
layout(location = 3) in vec2 textureCoords; 

uniform sampler2D myTexture; 

/// ks = Specular
/// kd = Diffuse
/// ka = ambient
/// kt = texture
/// α  = shinyness constant exponent

void main() {
    vec4 ks = vec4(0.3, 0.3, 0.3, 0.0);
	vec4 kd = vec4(0.6, 0.6, 0.3, 0.0);
	vec4 ka = 1.0 * kd;
	vec4 kt = texture(myTexture,textureCoords); 

	/// surface point normal and the direction of light normalize within the scale 1.0 , -1.0
	float diff = max(dot(vertNormal, lightDir), 0.0);

	/// Reflection is based 'incedent' which means a vector from the light source
	/// not the direction to the light source so flip the sign
	vec3 reflection = normalize(reflect(-lightDir, vertNormal));

	/// ks specular is the dot of the reflection vector and the position of the vertpos(eyeDir)
	/// specular exponent defines how shiny it will be
	float spec = max(dot(eyeDir, reflection), 0.0);
	spec = pow(spec, 15.0f);
	fragColor =  (ka + (diff * kd) + (spec * ks)) * kt;	
	
	/// Ip = KaIa + (Kd(Lm * N)I(m,d) + Ks(Rm * V)^α I(m,s))		Phong formula
	
	/// L  =  Light Source direction vector
	/// N  =  Normal from surface
	/// R  =  Reflection [Perfectly Directed Ray]
	/// V  =  Direction vector (depending on eyePos(vertPos))
}