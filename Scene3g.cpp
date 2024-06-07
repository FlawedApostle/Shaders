#include <glew.h>
#include <iostream>
#include <SDL.h>
#include <MMath.h>
#include "Scene3g.h"			/// scene3 
#include "Debug.h"
#include "Mesh.h"
#include "Shader.h"
#include "Body.h"
#include "Texture.h"
#include "TrackBall.h"

Scene3g::Scene3g() :
drawInWireMode(false),  
cubeBody(nullptr), 
cubeshader(nullptr), 
cubemesh(nullptr),
cubetexture(nullptr),
mouseMotionX{},
mouseMotionY{},
mouseWheelY{}
{
	Debug::Info("Created Scene0: ", __FILE__, __LINE__);
}

Scene3g::~Scene3g() {
	Debug::Info("Deleted Scene0: ", __FILE__, __LINE__);
}

bool Scene3g::OnCreate() {
	Debug::Info("Loading assets Scene0: ", __FILE__, __LINE__);
	cubeBody = new Body();
	cubeBody->OnCreate();

	// uniform Vec3 , manipulating the light position x, y , z 
	lightPos = Vec3(5.0f, 0.0f, 0.0f);

	// Plane.obj //	Mario.obj  
	cubemesh = new Mesh("meshes/Cube.obj");
	cubemesh->OnCreate();

	// mario_main.png // mario_fire.png // mario_main.png
	cubetexture = new Texture();
	cubetexture->LoadImage("textures/mario_fire.png");


	// texturePhongVert.glsl // texturePhongFrag.glsl // defaultVert.glsl // defaultFrag.glsl
	cubeshader = new Shader("shaders/PhongOriginal/Phong.vert", "shaders/PhongOriginal/Phong.frag");
	if (cubeshader->OnCreate() == false) {
		std::cout << "Shader failed ... we have a problem\n";
	}

	projectionMatrix = MMath::perspective(45.0f, (16.0f / 9.0f), 0.5f, 100.0f);
	viewMatrix = MMath::lookAt(Vec3(0.0f, 0.0f, 5.0f), Vec3(0.0f, 0.0f, 0.0f), Vec3(0.0f, 1.0f, 0.0f));
	modelMatrix = MMath::toMatrix4(Quaternion(1.0f, Vec3(0.0f, 0.0f, 0.0)));
	//modelMatrix.loadIdentity();
	return true;
}


// Kill
void Scene3g::OnDestroy() {
	Debug::Info("Deleting assets Scene0: ", __FILE__, __LINE__);
	cubeBody->OnDestroy();
	delete cubeBody;

	cubemesh->OnDestroy();
	delete cubemesh;

	cubeshader->OnDestroy();
	delete cubeshader;


}


void Scene3g::HandleEvents(const SDL_Event& sdlEvent) {
	trackball.HandleEvents(sdlEvent);
	switch (sdlEvent.type) {
	case SDL_KEYDOWN:
		switch (sdlEvent.key.keysym.scancode) {
		case SDL_SCANCODE_W:
			drawInWireMode = !drawInWireMode;
			printf("Scene1g - Wireframe\n");
			break;
		}
		break;

	case SDL_MOUSEMOTION:

		mouseMotionX = sdlEvent.motion.x;
		mouseMotionY = sdlEvent.motion.y;
		//if (mouseMotionX || mouseMotionY)
		//{
		//	printf("moving x , y (%i,%i)\n", mouseMotionX, mouseMotionY);

		//}
		// ModelMatrix move, doesnt move in tandem, I cant get it ... i know its something so simple..... im missing..
		//if (mouseMotionY)
		//{
		//	modelMatrix = MMath::rotate(mouseMotionY, Vec3(mouseMotionY, 0, 0));
		//}
		if (mouseMotionX)
		{
			//modelMatrix = MMath::rotate(mouseMotionX, Vec3(0, mouseMotionX, 0));
		}

		break;

	case SDL_MOUSEWHEEL:
		/// mouse scroll to zoom.... working 11:25AM // can scroll camera to 'scale' image in terms of user's perspective ,
		// using originalPerspective from where the model original model loads (P.O.O) point of origin, so yeah I just noticed this now later .... smh, what have I written....
		// changePerspective is set to 0 it will load the image at the frustum plane , originalPerspective = 45.0f the point of origin of the model
		mouseWheelY = sdlEvent.wheel.preciseY;
		if (mouseWheelY == mouseScrollPos)
		{
			//mouseWheelY + 1;
			printf("mouseWheel pos: %i\n", mouseWheelY);
			projectionMatrix = MMath::perspective(originalPerspective++, (16.0f / 9.0f), 0.5f, 100.0f);

		}
		else if (mouseWheelY == mouseScrollNeg)
		{

			printf("mouseWheel neg: %i\n", mouseWheelY);
			projectionMatrix = MMath::perspective(originalPerspective--, (16.0f / 9.0f), 0.5f, 100.0f);
		}
		break;


	case SDL_MOUSEBUTTONDOWN:
		break;

	case SDL_MOUSEBUTTONUP:
		break;

	default:
		break;
	}
}



void Scene3g::Update(const float deltaTime)
{
	cameraOrientationWorldSpace = trackball.getQuat();
	T = MMath::translate(cameraWorldSpace);
	R = MMath::toMatrix4(cameraOrientationWorldSpace);
	V = MMath::inverse(T) * MMath::inverse(R);

}

void Scene3g::Render() const {
	glEnable(GL_DEPTH_TEST);
	/// Set the background color then clear the screen
	glClearColor(0.0f, 0.0f, 0.0f, 0.0f);
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

	if (drawInWireMode) {
		glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
	}
	else {
		glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
	}
	glUseProgram(cubeshader->GetProgram());
	glBindTexture(GL_TEXTURE_2D, cubetexture->getTextureID());
	glUniformMatrix4fv(cubeshader->GetUniformID("projectionMatrix"), 1, GL_FALSE, projectionMatrix);
	glUniformMatrix4fv(cubeshader->GetUniformID("viewMatrix"), 1, GL_FALSE, V);
	glUniformMatrix4fv(cubeshader->GetUniformID("modelMatrix"), 1, GL_FALSE, modelMatrix);
	glUniform3fv(cubeshader->GetUniformID("lightPos"), 1, lightPos);
	cubemesh->Render(GL_TRIANGLES);
	glBindTexture(GL_TEXTURE_2D, 0);
	glUseProgram(0);
}




