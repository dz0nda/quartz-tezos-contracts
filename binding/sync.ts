import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
import * as el from "@completium/event-listener";
export class SyncEvent implements att.ArchetypeType {
    constructor(public timestamp: Date, public addr: att.Address, public message: string) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([att.date_to_mich(this.timestamp), this.addr.to_mich(), att.string_to_mich(this.message)]);
    }
    equals(v: SyncEvent): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): SyncEvent {
        return new SyncEvent(att.mich_to_date((input as att.Mpair).args[0]), att.Address.from_mich((input as att.Mpair).args[1]), att.mich_to_string((input as att.Mpair).args[2]));
    }
}
export class MessageEvent implements att.ArchetypeType {
    constructor(public timestamp: Date, public addr: att.Address, public msgtype: string, public msgcontent: string) { }
    toString(): string {
        return JSON.stringify(this, null, 2);
    }
    to_mich(): att.Micheline {
        return att.pair_to_mich([att.date_to_mich(this.timestamp), this.addr.to_mich(), att.string_to_mich(this.msgtype), att.string_to_mich(this.msgcontent)]);
    }
    equals(v: MessageEvent): boolean {
        return att.micheline_equals(this.to_mich(), v.to_mich());
    }
    static from_mich(input: att.Micheline): MessageEvent {
        return new MessageEvent(att.mich_to_date((input as att.Mpair).args[0]), att.Address.from_mich((input as att.Mpair).args[1]), att.mich_to_string((input as att.Mpair).args[2]), att.mich_to_string((input as att.Mpair).args[3]));
    }
}
const doEmit_arg_to_mich = (imessage: string): att.Micheline => {
    return att.string_to_mich(imessage);
}
const doMessage_arg_to_mich = (imsgtype: string, imsgcontent: string): att.Micheline => {
    return att.pair_to_mich([
        att.string_to_mich(imsgtype),
        att.string_to_mich(imsgcontent)
    ]);
}
export class Sync {
    address: string | undefined;
    constructor(address: string | undefined = undefined) {
        this.address = address;
    }
    get_address(): att.Address {
        if (undefined != this.address) {
            return new att.Address(this.address);
        }
        throw new Error("Contract not initialised");
    }
    async get_balance(): Promise<att.Tez> {
        if (null != this.address) {
            return await ex.get_balance(new att.Address(this.address));
        }
        throw new Error("Contract not initialised");
    }
    async deploy(params: Partial<ex.Parameters>) {
        const address = (await ex.deploy("./contracts/sync.arl", {}, params)).address;
        this.address = address;
    }
    async doEmit(imessage: string, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "doEmit", doEmit_arg_to_mich(imessage), params);
        }
        throw new Error("Contract not initialised");
    }
    async doMessage(imsgtype: string, imsgcontent: string, params: Partial<ex.Parameters>): Promise<att.CallResult> {
        if (this.address != undefined) {
            return await ex.call(this.address, "doMessage", doMessage_arg_to_mich(imsgtype, imsgcontent), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_doEmit_param(imessage: string, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "doEmit", doEmit_arg_to_mich(imessage), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_doMessage_param(imsgtype: string, imsgcontent: string, params: Partial<ex.Parameters>): Promise<att.CallParameter> {
        if (this.address != undefined) {
            return await ex.get_call_param(this.address, "doMessage", doMessage_arg_to_mich(imsgtype, imsgcontent), params);
        }
        throw new Error("Contract not initialised");
    }
    async get_metadata_value(key: string): Promise<att.Bytes | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(att.Int.from_mich(storage).toString()), att.string_to_mich(key), att.prim_annot_to_mich_type("string", []));
            if (data != undefined) {
                return att.Bytes.from_mich(data);
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_metadata_value(key: string): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(att.Int.from_mich(storage).toString()), att.string_to_mich(key), att.prim_annot_to_mich_type("string", []));
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        throw new Error("Contract not initialised");
    }
    register_SyncEvent(ep: el.EventProcessor<SyncEvent>) {
        if (this.address != undefined) {
            el.registerEvent({ source: this.address, filter: tag => { return tag == "SyncEvent"; }, process: (raw: any, data: el.EventData | undefined) => {
                    const event = (x => {
                        return SyncEvent.from_mich(x);
                    })(raw);
                    ep(event, data);
                } });
            return;
        }
        throw new Error("Contract not initialised");
    }
    register_MessageEvent(ep: el.EventProcessor<MessageEvent>) {
        if (this.address != undefined) {
            el.registerEvent({ source: this.address, filter: tag => { return tag == "MessageEvent"; }, process: (raw: any, data: el.EventData | undefined) => {
                    const event = (x => {
                        return MessageEvent.from_mich(x);
                    })(raw);
                    ep(event, data);
                } });
            return;
        }
        throw new Error("Contract not initialised");
    }
    errors = {};
}
export const sync = new Sync();
