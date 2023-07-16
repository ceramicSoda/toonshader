export const fuzeVS = /*glsl*/`
    varying vec3 vNormal; 
    void main(){
        vNormal = normalMatrix * normalize(normal); 
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
`
export const fuzeFS = /*glsl*/`
    varying vec3 vNormal; 
    
    void main(){
        vec4 c = vec4(uColor, 1.0); 
        gl_FragColor = vec4( pow(c.xyz,vec3(0.454545)), c.w );
    }
`
