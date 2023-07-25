export const fuzeVS = /*glsl*/`
    varying vec2    vUV;
    varying vec3    vNormal; 
    varying vec4    vFragPos;
    void main(){
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        vUV = vec2(1.)  - uv; 
        vFragPos = modelViewMatrix * vec4(position, 1.);
        vNormal = normalMatrix * normalize(normal);
    }
`
export const fuzeFS = /*glsl*/`
    #include <common> 
    #include <lights_pars_begin>
    uniform vec3    uColor;
    uniform float   uState; 
    varying vec2    vUV;
    varying vec3    vNormal; 
    varying vec4    vFragPos;
    
    vec4 getSpecular(){
        vec4 combo; 
        vec3 l;
        for(int i=0; i<pointLights.length(); i++){
            l = normalize(pointLights[i].position - vFragPos.xyz); 
            l = 2.0 * dot(normalize(vNormal), l) * normalize(vNormal) - l;
            combo = vec4( vec3(step(dot(l, normalize(vFragPos.xyz)), -0.92)), 1.);
        }
        return combo; 
    }
    vec4 geDirecttL(){
        vec4 combo; 
        for(int i=0; i<pointLights.length(); i++){
            
        }
        return combo; 
    }
    vec4 getPointL(){
        vec4 combo; 
        
        return combo; 
    }

    void main(){
        vec3 cLight = vec3(uColor.r + 1., uColor.g + .1, uColor.b);
        vec4 c = vec4(uColor * step(vUV.y, (uState)), 1.); 
        c = getSpecular();
        c = c + vec4(cLight * step(uState, vUV.y) * step(vUV.y, (uState + 0.15)),  1.);
        gl_FragColor = vec4( pow(c.xyz,vec3(0.454545)), c.w );
    }
`
