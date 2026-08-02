"use client";

import { useEffect, useState } from "react";
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    message,
    Modal,
    Radio,
    Row,
    Select,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import type {
    CollectorDTO,
    CollectorForOnboarding,
    GroupDTO,
    StudentOnboardingRequest,
} from "@kubuci-hort/types";
import { getCollectors } from "@/src/features/collectors/api";
import { createStudentOnboarding } from "@/src/features/students/api";

type Props = {
    open: boolean;
    groups: GroupDTO[];
    onClose: () => void;
    onCreated?: () => void;
};

type CollectorFormValue = {
    source: "NEW" | "EXISTING";
    existingCollectorId?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    phone?: string;
    mainCollector: boolean;
};

type StudentFormValue = {
    student: {
        firstName: string;
        lastName: string;
        address?: string;
        phone?: string;
    };
    groupId: string;
    collectors: CollectorFormValue[];
};

const initialCollector: CollectorFormValue = {
    source: "NEW",
    mainCollector: true,
};

export default function AddStudentModal({ open, groups, onClose, onCreated }: Props) {
    const [form] = Form.useForm<StudentFormValue>();
    const [loading, setLoading] = useState(false);
    const [collectors, setCollectors] = useState<CollectorDTO[]>([]);

    useEffect(() => {
        if (!open) return;
        void getCollectors()
            .then(setCollectors)
            .catch((error) => {
                console.error(error);
                message.error("Vorhandene Abholer konnten nicht geladen werden");
            });
    }, [open]);

    const close = () => {
        form.resetFields();
        onClose();
    };

    const selectMainCollector = (index: number) => {
        const values = form.getFieldValue("collectors") ?? [];
        form.setFieldValue("collectors", values.map((collector, current) => ({
            ...collector,
            mainCollector: current === index,
        })));
        void form.validateFields([["collectors"]]);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const collectorRequests: CollectorForOnboarding[] = values.collectors.map((collector) => {
                const permission = {
                    permissionType: "PERMANENT" as const,
                    validFrom: null,
                    validUntil: null,
                    mainCollector: collector.mainCollector,
                };
                if (collector.source === "EXISTING") {
                    return {
                        ...permission,
                        source: "EXISTING",
                        existingCollectorId: collector.existingCollectorId!,
                    };
                }
                return {
                    ...permission,
                    source: "NEW",
                    newCollector: {
                        firstName: collector.firstName!,
                        lastName: collector.lastName!,
                        address: collector.address || undefined,
                        phone: collector.phone || undefined,
                    },
                };
            });

            const payload: StudentOnboardingRequest = {
                student: {
                    ...values.student,
                    address: values.student.address || undefined,
                    phone: values.student.phone || undefined,
                },
                groupId: values.groupId,
                collectors: collectorRequests,
            };

            setLoading(true);
            await createStudentOnboarding(payload);
            message.success("Schüler wurde erfolgreich hinzugefügt");
            close();
            onCreated?.();
        } catch (error) {
            console.error(error);
            message.error("Fehler beim Speichern des Schülers");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Schüler Onboarding"
            open={open}
            onCancel={close}
            onOk={handleSubmit}
            okText="Speichern"
            confirmLoading={loading}
            width={820}
            destroyOnHidden
        >
            <Form<StudentFormValue>
                form={form}
                layout="vertical"
                initialValues={{ collectors: [initialCollector] }}
            >
                <Divider orientation="horizontal" titlePlacement="left">Schüler</Divider>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name={["student", "firstName"]} label="Vorname"
                            rules={[{ required: true, message: "Pflichtfeld" }]}>
                            <Input maxLength={120} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name={["student", "lastName"]} label="Nachname"
                            rules={[{ required: true, message: "Pflichtfeld" }]}>
                            <Input maxLength={120} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="groupId" label="Gruppe"
                            rules={[{ required: true, message: "Bitte eine Gruppe auswählen" }]}>
                            <Select
                                showSearch
                                optionFilterProp="label"
                                options={groups.map((group) => ({ value: group.id, label: group.name }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={16}>
                        <Form.Item name={["student", "address"]} label="Adresse">
                            <Input maxLength={250} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name={["student", "phone"]} label="Telefon">
                            <Input maxLength={40} />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider orientation="horizontal" titlePlacement="left">Abholberechtigte</Divider>
                <Form.List
                    name="collectors"
                    rules={[{
                        validator: async (_, values: CollectorFormValue[] | undefined) => {
                            if (!values?.length) throw new Error("Mindestens ein Abholer ist erforderlich");
                            if (values.filter((collector) => collector.mainCollector).length !== 1) {
                                throw new Error("Genau ein Hauptabholer ist erforderlich");
                            }
                        },
                    }]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} style={{ borderBottom: "1px solid #f0f0f0", marginBottom: 16 }}>
                                    <Row gutter={16} align="middle">
                                        <Col span={7}>
                                            <Form.Item {...restField} name={[name, "source"]} label="Abholer"
                                                rules={[{ required: true }]}>
                                                <Select options={[
                                                    { value: "NEW", label: "Neuen Abholer anlegen" },
                                                    { value: "EXISTING", label: "Vorhandenen Abholer wählen" },
                                                ]} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={7}>
                                            <Form.Item label="Hauptabholer">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "mainCollector"]}
                                                    valuePropName="checked"
                                                    noStyle
                                                >
                                                    <Radio onChange={() => selectMainCollector(name)}>
                                                        Hauptabholer
                                                    </Radio>
                                                </Form.Item>
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            {fields.length > 1 && <MinusCircleOutlined
                                                onClick={() => remove(name)}
                                                style={{ color: "#ff4d4f", cursor: "pointer" }}
                                            />}
                                        </Col>
                                    </Row>

                                    <Form.Item noStyle shouldUpdate>
                                        {() => form.getFieldValue(["collectors", name, "source"]) === "EXISTING" ? (
                                            <Form.Item {...restField} name={[name, "existingCollectorId"]}
                                                label="Vorhandener Abholer"
                                                rules={[{ required: true, message: "Bitte einen Abholer auswählen" }]}>
                                                <Select
                                                    showSearch
                                                    optionFilterProp="label"
                                                    options={collectors.map((collector) => ({
                                                        value: collector.id,
                                                        label: `${collector.firstName} ${collector.lastName}${collector.phone ? ` (${collector.phone})` : ""}`,
                                                    }))}
                                                />
                                            </Form.Item>
                                        ) : (
                                            <Row gutter={16}>
                                                <Col span={6}>
                                                    <Form.Item {...restField} name={[name, "firstName"]} label="Vorname"
                                                        rules={[{ required: true, message: "Pflichtfeld" }]}>
                                                        <Input maxLength={120} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={6}>
                                                    <Form.Item {...restField} name={[name, "lastName"]} label="Nachname"
                                                        rules={[{ required: true, message: "Pflichtfeld" }]}>
                                                        <Input maxLength={120} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={7}>
                                                    <Form.Item {...restField} name={[name, "address"]} label="Adresse">
                                                        <Input maxLength={250} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={5}>
                                                    <Form.Item {...restField} name={[name, "phone"]} label="Telefon">
                                                        <Input maxLength={40} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        )}
                                    </Form.Item>
                                </div>
                            ))}
                            <Form.ErrorList errors={errors} />
                            <Form.Item>
                                <Button type="dashed"
                                    onClick={() => add({ source: "NEW", mainCollector: false })}
                                    block icon={<PlusOutlined />}>
                                    Abholer hinzufügen
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
}
