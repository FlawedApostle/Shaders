#pragma once
#ifndef SCENE3G_H
#define SCENE3G_H
#include "Scene.h"
#include <Vector.h>
#include <Matrix.h>
#include "TrackBall.h"
using namespace MATH;

/// Forward declarations 
union SDL_Event;
class Body;
class Mesh;
class Shader;
class Texture;
class Trackball;

class Scene3g : public Scene {
private:
	Trackball trackball;
	Matrix4 T;
	Matrix4 R;
	Matrix4 V;
	Vec3 cameraWorldSpace;
	Quaternion cameraOrientationWorldSpace;

	
	Body* cubeBody;				// default body
	Shader* cubeshader;				// default shader
	Mesh* cubemesh;					// default mesh
	Texture* cubetexture;			// default texture


	Matrix4 projectionMatrix;
	Matrix4 viewMatrix;
	Matrix4 modelMatrix;
	bool drawInWireMode;

	Vec3 lightPos;				// uniform lightPos


	//Mouse motion
	int mouseMotionX;
	int mouseMotionY;
	// mouse wheel
	int mouseWheelY;
	int originalPerspective = 45.0f;
	int mouseScrollPos = 1;
	int mouseScrollNeg = -1;

public:
	explicit Scene3g();
	virtual ~Scene3g();

	virtual bool OnCreate() override;
	virtual void OnDestroy() override;
	virtual void Update(const float deltaTime) override;
	virtual void Render() const override;
	virtual void HandleEvents(const SDL_Event& sdlEvent) override;
};


#endif  SCENE3G_H