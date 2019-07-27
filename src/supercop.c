#define ED25519_NO_SEED true

#include "../vendor/src/ed25519.h"
#include "../vendor/src/ge.h"

void ed25519_get_publickey(unsigned char *private_key, unsigned char *public_key) {
    ge_p3 A;

    private_key[0] &= 248;
    private_key[31] &= 63;
    private_key[31] |= 64;

    ge_scalarmult_base(&A, private_key);
    ge_p3_tobytes(public_key, &A);
}
