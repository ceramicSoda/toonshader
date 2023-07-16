export const bombVert = /*glsl*/`
    varying vec3 vNormal; 
    varying vec3 vViewPosition;
    varying vec4 vFragPos;
    void main(){
        vNormal = normalMatrix * normalize(normal); 
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        vViewPosition = -normalize((modelViewMatrix * vec4(position, 1.)).xyz);
        vFragPos = modelViewMatrix * vec4(position, 1.);
    }
`
export const bombFrag = /*glsl*/`
    #include <common> 
    #include <lights_pars_begin>
    uniform vec3 uColor; 
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec4 vFragPos;
    
    vec4 getSpecular(){
        vec3 l, dist, halfVec; 
        float lPower; 
        vec4 sum;
        for(int i=0; i<pointLights.length(); i++){
            l = normalize(pointLights[i].position - vFragPos.xyz + vec3(1., 0.4, -0.1)); 
            l = 2.0 * dot(normalize(vNormal), l) * normalize(vNormal) - l;
            dist = normalize(-vFragPos.xyz); 
            lPower = max(dot(l, dist), 0.);
            lPower = round(pow(lPower, 32.));
            sum += vec4(lPower * pointLights[i].color, lPower);
        }
        return sum;
    }
    
    void main(){
        vec4 c = vec4(0., 0., 0., 0.);
        float rim = floor(1.3 - dot(vViewPosition, vNormal));
        float rim = 0.7 - dot(vViewPosition, vNormal);
        c = getSpecular();
        c = c + vec4(uColor * rim, rim); 
        gl_FragColor = vec4( pow(c.xyz,vec3(0.454545)), c.w );
    }
`
