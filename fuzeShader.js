export const fuzeVS = /*glsl*/`
    varying vec2    vUV;
    varying vec3    vNormal; 
    varying vec4    vFragPos;
    varying vec4    vWorldPos;
    void main(){
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        vUV = vec2(1.)  - uv; 
        vFragPos = modelViewMatrix * vec4(position, 1.);
        vWorldPos = modelMatrix * vec4(position, 1.);
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
    varying vec4    vWorldPos;
    
    vec4 getSpecular(){
        vec4 combo; 
        vec3 l;
        for(int i=0; i<pointLights.length(); i++){
            l = normalize(pointLights[i].position - vFragPos.xyz); 
            l = 2.0 * dot(normalize(vNormal), l) * normalize(vNormal) - l;
            l = vec3(dot(l, normalize(vFragPos.xyz))); 
            combo = vec4(pointLights[i].color * step(dot(-l, normalize(vFragPos.xyz)), -0.8), 1.);
        }
        return combo; 
    }
    vec4 getDirecttL(){
        vec4    combo; 
        vec3    diff; 
        for(int i=0; i<directionalLights.length(); i++){
            diff = directionalLights[i].color * step(1., dot(directionalLights[i].direction, vNormal)) / 4.;
            combo = vec4(diff, 1.);
        }
        return combo; 
    }
    vec4 getPointL(){
        vec4    combo; 
        vec3    lToPos, spec, diff; 
        float   lToNorm; 
        for(int i=0; i<pointLights.length(); i++){
            lToPos = pointLights[i].position - vFragPos.xyz; 
            lToNorm = dot(lToPos, vNormal);

            spec = 2. * lToNorm * vNormal - lToNorm; 
            spec = pointLights[i].color * step(dot(spec, vFragPos.xyz), -400.); 
            
            diff = pointLights[i].color * step(length(lToPos), pointLights[i].distance);
            diff = diff * step(1., dot(lToPos, vNormal)) / 4.;
            combo = vec4(diff, 1.);
        }
        return combo; 
    }

    void main(){
        vec3 cLight = vec3(uColor.r + 1., uColor.g + .1, uColor.b);
        vec4 c = vec4(uColor * step(vUV.y, (uState)), 1.); 
        //c = getSpecular();
        //c = c + vec4(cLight * step(uState, vUV.y) * step(vUV.y, (uState + 0.15)),  1.);
        c = getDirecttL() + getPointL();
        gl_FragColor = vec4( pow(c.xyz,vec3(0.454545)), c.w );
    }
`
