import { assert, test } from "@hazae41/phobos";
import { Aes128Ctr128BEKey, Memory, initBundled } from "./index.js";

function equals(a: Uint8Array, b: Uint8Array) {
  return Buffer.from(a).equals(Buffer.from(b))
}

test("AES-128 + CTR-128-BE", async () => {
  await initBundled()

  const plaintext = new TextEncoder().encode("Hello World")

  using memory = new Memory(plaintext)

  const key = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(16))

  using key_memory = new Memory(key)
  using iv_memory = new Memory(iv)

  using cipher = new Aes128Ctr128BEKey(key_memory, iv_memory)
  using decipher = new Aes128Ctr128BEKey(key_memory, iv_memory)

  /**
   * Encryption
   */

  cipher.apply_keystream(memory)
  const encrypted1 = memory.bytes.slice()

  assert(!equals(encrypted1, plaintext), `encrypted1 should not be equals to plaintext`)

  cipher.apply_keystream(memory)
  const encrypted2 = memory.bytes.slice()

  assert(!equals(encrypted2, plaintext), `encrypted2 should not be equals to plaintext`)
  assert(!equals(encrypted2, encrypted1), `encrypted2 should not be equals to encrypted1`)

  /**
   * Decryption
   */

  decipher.apply_keystream(memory)
  const decrypted1 = memory.bytes.slice()

  assert(!equals(decrypted1, plaintext), `decrypted1 should not be equals to plaintext`)

  decipher.apply_keystream(memory)
  const decrypted2 = memory.bytes.slice()

  assert(!equals(decrypted2, decrypted1), `decrypted2 should not be equals to decrypted1`)
  assert(equals(decrypted2, plaintext), `decrypted2 should be equals to plaintext`)
})
