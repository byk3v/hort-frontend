"use client";

import {useCallback, useEffect, useState} from "react";
import {Checkbox, Col, DatePicker, Form, Input, message, Modal, Radio, Row, Select, Space, Table, TimePicker} from "antd";
import type {ColumnsType} from "antd/es/table";
import dayjs, {Dayjs} from "dayjs";
import {CollectorDTO, NewPermissionRequest, StudentDTO, Weekday} from "@kubuci-hort/types";
import {getStudents} from "@/src/features/students/api";
import {getCollectors} from "@/src/features/collectors/api";
import {createNewPermission} from "../api";

type FormValues = {
    studentId?: string;
    duration: "DAILY" | "PERMANENT";
    canLeaveAlone: boolean;
    validDate?: Dayjs;
    startTime?: Dayjs;
    validFrom?: Dayjs;
    validUntil?: Dayjs;
    collectorSource: "NEW" | "EXISTING";
    existingCollectorId?: string;
    firstName?: string; lastName?: string; address?: string; phone?: string;
    monday?: Dayjs; tuesday?: Dayjs; wednesday?: Dayjs; thursday?: Dayjs; friday?: Dayjs;
};

const weekdays: {field: keyof FormValues; day: Weekday; label: string}[] = [
    {field: "monday", day: "MONDAY", label: "Montag"}, {field: "tuesday", day: "TUESDAY", label: "Dienstag"},
    {field: "wednesday", day: "WEDNESDAY", label: "Mittwoch"}, {field: "thursday", day: "THURSDAY", label: "Donnerstag"},
    {field: "friday", day: "FRIDAY", label: "Freitag"},
];

export default function AddPermissionModal({open, onClose, onCreated}: {open: boolean; onClose: () => void; onCreated?: () => void}) {
    const [form] = Form.useForm<FormValues>();
    const [students, setStudents] = useState<StudentDTO[]>([]);
    const [collectors, setCollectors] = useState<CollectorDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const duration = Form.useWatch("duration", form) ?? "DAILY";
    const selfDismissal = Form.useWatch("canLeaveAlone", form) ?? false;
    const collectorSource = Form.useWatch("collectorSource", form) ?? "NEW";
    const selectedStudentId = Form.useWatch("studentId", form);

    useEffect(() => {
        if (!open) return;
        form.resetFields();
        form.setFieldsValue({duration: "DAILY", canLeaveAlone: false, collectorSource: "NEW"});
        setStudents([]);
        void getCollectors().then(setCollectors).catch(console.error);
    }, [open, form]);

    const search = useCallback(async (value: string) => {
        if (value.trim().length < 2) { setStudents([]); return; }
        try { setStudents((await getStudents({name: value.trim(), page: 0, size: 20})).items); }
        catch (error) { console.error(error); message.error("Fehler bei der Schülersuche"); }
    }, []);

    const submit = async () => {
        if (!selectedStudentId) { message.error("Bitte ein Kind auswählen"); return; }
        let values: FormValues;
        try { values = await form.validateFields(); } catch { return; }

        const validFrom = values.duration === "DAILY"
            ? values.validDate!.hour(values.startTime!.hour()).minute(values.startTime!.minute()).second(0)
            : (values.validFrom ?? dayjs()).startOf("day");
        const validUntil = values.duration === "DAILY"
            ? values.validDate!.endOf("day")
            : values.validUntil?.endOf("day");

        const request: NewPermissionRequest = {
            studentId: values.studentId!,
            kind: selfDismissal ? "SELF_DISMISSAL" : "PICKUP_RIGHT",
            duration,
            validFrom: validFrom.toISOString(),
            validUntil: validUntil?.toISOString() ?? null,
        };

        if (selfDismissal && duration === "DAILY") request.allowedFromTime = values.startTime!.format("HH:mm:ss");
        if (selfDismissal && duration === "PERMANENT") {
            request.weeklyRules = weekdays.flatMap(({field, day}) => {
                const time = values[field] as Dayjs | undefined;
                return time ? [{dayOfWeek: day, allowedFromTime: time.format("HH:mm:ss")}] : [];
            });
            if (request.weeklyRules.length === 0) { message.error("Bitte mindestens einen Wochentag festlegen"); return; }
        }
        if (!selfDismissal) {
            request.collector = collectorSource === "EXISTING"
                ? {source: "EXISTING", existingCollectorId: values.existingCollectorId}
                : {source: "NEW", newCollector: {firstName: values.firstName!, lastName: values.lastName!, address: values.address, phone: values.phone}};
            if (duration === "DAILY") request.allowedFromTime = values.startTime!.format("HH:mm:ss");
        }

        try {
            setLoading(true); await createNewPermission(request); message.success("Vollmacht erstellt"); onCreated?.();
        } catch (error) { console.error(error); message.error("Fehler beim Erstellen der Vollmacht"); }
        finally { setLoading(false); }
    };

    const columns: ColumnsType<StudentDTO> = [
        {title: "Name", render: (_, row) => `${row.firstName} ${row.lastName}`},
        {title: "Gruppe", render: (_, row) => row.group.name},
    ];

    return <Modal open={open} onCancel={onClose} onOk={submit} confirmLoading={loading} title="Neue Vollmacht" width={850} destroyOnHidden>
        <Space orientation="vertical" size="middle" style={{width: "100%"}}>
            <Input.Search placeholder="Schüler suchen" onSearch={search} onChange={event => { if (event.target.value.length >= 2) void search(event.target.value); }}/>
            <Table size="small" rowKey="id" columns={columns} dataSource={students} pagination={false}
                   rowSelection={{
                       type: "radio",
                       selectedRowKeys: selectedStudentId ? [selectedStudentId] : [],
                       onChange: (keys) => form.setFieldValue("studentId", keys[0]?.toString()),
                   }}
                   onRow={row => ({onClick: () => form.setFieldValue("studentId", row.id)})}/>
            <Form form={form} layout="vertical">
                <Form.Item name="studentId" hidden rules={[{required: true, message: "Bitte ein Kind auswählen"}]}>
                    <Input/>
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}><Form.Item name="duration" label="Art" rules={[{required: true}]}><Radio.Group options={[{value: "DAILY", label: "Tagesvollmacht"}, {value: "PERMANENT", label: "Dauervollmacht"}]}/></Form.Item></Col>
                    <Col span={12}><Form.Item name="canLeaveAlone" valuePropName="checked"><Checkbox>Kind darf allein gehen</Checkbox></Form.Item></Col>
                </Row>
                {duration === "DAILY" ? <Row gutter={16}>
                    <Col span={12}><Form.Item name="validDate" label="Datum" rules={[{required: true}]}><DatePicker style={{width: "100%"}}/></Form.Item></Col>
                    <Col span={12}><Form.Item name="startTime" label="Gültig ab" rules={[{required: true}]}><TimePicker format="HH:mm" style={{width: "100%"}}/></Form.Item></Col>
                </Row> : <Row gutter={16}>
                    <Col span={12}><Form.Item name="validFrom" label="Gültig ab"><DatePicker style={{width: "100%"}}/></Form.Item></Col>
                    <Col span={12}><Form.Item name="validUntil" label="Gültig bis"><DatePicker style={{width: "100%"}}/></Form.Item></Col>
                </Row>}
                {selfDismissal && duration === "PERMANENT" && <Row gutter={12}>{weekdays.map(({field, label}) => <Col span={8} key={field}><Form.Item name={field} label={label}><TimePicker format="HH:mm" style={{width: "100%"}}/></Form.Item></Col>)}</Row>}
                {!selfDismissal && <>
                    <Form.Item name="collectorSource" label="Abholer"><Radio.Group options={[{value: "NEW", label: "Neu"}, {value: "EXISTING", label: "Vorhanden"}]}/></Form.Item>
                    {collectorSource === "EXISTING"
                        ? <Form.Item name="existingCollectorId" label="Abholer" rules={[{required: true}]}><Select showSearch optionFilterProp="label" options={collectors.map(c => ({value: c.id, label: `${c.firstName} ${c.lastName}`}))}/></Form.Item>
                        : <Row gutter={12}>
                            <Col span={12}><Form.Item name="firstName" label="Vorname" rules={[{required: true}]}><Input/></Form.Item></Col>
                            <Col span={12}><Form.Item name="lastName" label="Nachname" rules={[{required: true}]}><Input/></Form.Item></Col>
                            <Col span={12}><Form.Item name="address" label="Adresse"><Input/></Form.Item></Col>
                            <Col span={12}><Form.Item name="phone" label="Telefon"><Input/></Form.Item></Col>
                        </Row>}
                </>}
            </Form>
        </Space>
    </Modal>;
}
