import { Bytes, Key, Nat, Option, Or, pair_to_mich, Signature, string_to_mich } from '@completium/archetype-ts-types'
import { blake2b, expect_to_fail, get_account, set_endpoint, set_mockup, set_mockup_now, set_quiet } from '@completium/experiment-ts'

import { get_packed_transfer_params, get_transfer_permit_data, get_missigned_error, wrong_packed_transfer_params, wrong_sig } from './utils'

import assert from 'assert';

/* Contracts */

import { aleph_token } from '../binding/aleph_token';
import { balance_of_request, nft, gasless_param, operator_param, part, transfer_destination, transfer_param } from '../binding/nft';
import { add, Permits, permits, permits_value, user_permit } from '../binding/permits';
import { sync } from '../binding/sync';

/* Accounts ----------------------------------------------------------------- */

const originator = get_account('alice');
const aleph_token_owner = get_account('alice');
const nft_owner = get_account('alice');

/* Endpoint ---------------------------------------------------------------- */

set_endpoint("https://ghostnet.ecadinfra.com")

/* Verbose mode ------------------------------------------------------------ */

// set_quiet(true);

const permits_aleph_tokens = new Permits()

describe('[NFT] Contracts deployment', async () => {
  it('Permits contract deployment should succeed', async () => {
    await permits_aleph_tokens.deploy(aleph_token_owner.get_address(), { as: originator })
  });

  it('Aleph Token contract deployment should succeed', async () => {
    await aleph_token.deploy(aleph_token_owner.get_address(), permits_aleph_tokens.get_address(), { as: originator })
  });

  it('Sync contract deployment should succeed', async () => {
    await sync.deploy({ as: originator })
  });

  it('Permits contract deployment should succeed', async () => {
    await permits.deploy(nft_owner.get_address(), { as: originator })
  });

  it('NFT contract deployment should succeed', async () => {
    await nft.deploy(nft_owner.get_address(), permits.get_address(), aleph_token.get_address(), sync.get_address(), { as: originator })
  });
});

describe('[NFT] Contract configuration', async () => {
  it("Add FA2 as permit consumer", async () => {
    await permits_aleph_tokens.manage_consumer(new add(aleph_token.get_address()), { as: originator })
  })

  it("Add FA2 as permit consumer", async () => {
    await permits.manage_consumer(new add(nft.get_address()), { as: originator })
  })
})
