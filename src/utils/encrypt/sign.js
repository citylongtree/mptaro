import RSA from './wxapp_rsa'

var privateKey = '-----BEGIN RSA PRIVATE KEY-----MIICXAIBAAKBgQDSTjEXHAT196Is2QtmQHU0kpXVaY6nfYYEc4tyTAirwOUsSsnGH0+iZfNhhseUyGjyOh+Mrg3qDgN+CLn0OLiuHDVWMQu9lRxH4EV6blaI8c2HPv6ZaqoTsBL1dE5sJXlIs52J5S9hW5DssGS4qMzenJbfxPb6eMK3IY0DxjFb4QIDAQABAoGAZRxs47R3+h4uHavYnDe/YiBb43hVutdR2NAIqlI+FP2v8WSfsB6btfOYWTpouHLGajdhtcx1KiPEsBLX/MBMoaIWXo4g/8r8TDuFSJFRC/cHBe6bj0oO3a3Ww1/1EhP4pXjOfhRrEbMN0HmWlSgH5AZ0ly5h0VI7FrC1pP2NCPECQQDo1zuPDxbXuCUG/2X/w4CEbxzeJfvZj1RPmq4GkAR4o984Cr7jvTOFJNBo/IqxMVBdpNmthtx1ns1i7sE2FEp9AkEA5zkl2U+13CRrtlE3z1mvz5iYuXENHx08YI48/aLUX+lc1DSlM8sYKwlXv4mp0p2cWPSga3SByGEf+nY1NmiwNQJAYI/aQGMGmyHgIT3L5D0E0GdwNmTURI6fbX/9ifUyFYIIcaprLfFqK15wHAoXzpJf/OX/7GoQhar9DHltoWra1QJBAM43QJNELOxuKwZJ/x1VXqAl9yeENPCn8V4n3StUGlaD2P+FCEVd/2r6hSDVFPk7CeKoIZ5UJR9hx9RnsmOZEHUCQCdQXM6pO9KabwErBwVAXX5LOaStrghlGf3FrNK3IVgvG6xqbTbAwvdQCR19l7vVxCqXRSTQsv2QuyHEG96rQOg=-----END RSA PRIVATE KEY-----';
export default {
    doSign:function(signData){
        // console.log(signData)
        var rsa = new RSA.RSAKey(); // 新建RSA对象
        rsa = RSA.KEYUTIL.getKey(privateKey); // 设置私钥
        var hashAlg = 'sha1'; // 设置sha1
        var hSig = rsa.signString(signData, hashAlg); // 加签
        hSig = RSA.hex2b64(hSig); // hex 转 b64
        return hSig;
    }
}
