"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Input, message, Select, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import type { GroupDTO, StudentCollectorDTO, StudentDTO } from "@kubuci-hort/types";
import { useAuth } from "@/src/auth/AuthProvider";
import { getGroups } from "@/src/features/groups/api";
import { getStudents } from "@/src/features/students/api";
import AddStudentModal from "./AddStudentModal";

const { Title, Text } = Typography;

export default function StudentsClient() {
    const { roles } = useAuth();
    const canOnboardStudents = roles.includes("HORT_ADMIN");
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<StudentDTO[]>([]);
    const [groups, setGroups] = useState<GroupDTO[]>([]);
    const [name, setName] = useState("");
    const [groupId, setGroupId] = useState<string>();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(0);
    const [openAdd, setOpenAdd] = useState(false);

    const load = async (
        nextPage = page,
        nextSize = pageSize,
        nextName = name,
        nextGroupId = groupId,
    ) => {
        try {
            setLoading(true);
            const data = await getStudents({
                name: nextName.trim() || undefined,
                groupId: nextGroupId,
                page: nextPage,
                size: nextSize,
                sort: "lastName,asc",
            });
            setRows(data.items);
            setPage(data.page);
            setPageSize(data.size);
            setTotal(data.totalElements);
        } catch (error) {
            console.error(error);
            message.error("Fehler beim Laden der Schülerliste");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void getGroups().then(setGroups).catch((error) => console.error(error));
        void load(0, 20);
        // Initial server page. Later requests are triggered explicitly by the controls.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSearch = () => void load(0, pageSize);

    const onReset = () => {
        setName("");
        setGroupId(undefined);
        void load(0, pageSize, "", undefined);
    };

    const onPageChange = (pagination: TablePaginationConfig) => {
        const nextPage = Math.max((pagination.current ?? 1) - 1, 0);
        const nextSize = pagination.pageSize ?? pageSize;
        void load(nextPage, nextSize);
    };

    const columns: ColumnsType<StudentDTO> = useMemo(() => [
        {
            title: "Name",
            key: "name",
            render: (_, student) => `${student.firstName} ${student.lastName}`,
        },
        {
            title: "Gruppe",
            key: "group",
            width: 140,
            render: (_, student) => student.group.name,
        },
        {
            title: "Adresse",
            dataIndex: "address",
            key: "address",
            ellipsis: true,
        },
        {
            title: "Allein gehen?",
            dataIndex: "canLeaveAlone",
            key: "canLeaveAlone",
            width: 140,
            render: (value: boolean) => value ? <Tag color="green">Ja</Tag> : <Tag>Nein</Tag>,
        },
        {
            title: "Berechtigte Abholer",
            key: "collectorsCount",
            width: 180,
            render: (_, student) => <Text>{student.collectors.length}</Text>,
        },
    ], []);

    const renderCollectors = (collectors: StudentCollectorDTO[]) => (
        <Table<StudentCollectorDTO>
            size="small"
            rowKey="pickupRightId"
            columns={[
                { title: "Vorname", dataIndex: "firstName", key: "firstName", width: 160 },
                { title: "Nachname", dataIndex: "lastName", key: "lastName", width: 160 },
                { title: "Telefon", dataIndex: "phone", key: "phone", width: 160 },
                { title: "Adresse", dataIndex: "address", key: "address", ellipsis: true },
                {
                    title: "Hauptabholer",
                    dataIndex: "mainCollector",
                    key: "mainCollector",
                    render: (value: boolean) => value ? <Tag color="blue">Ja</Tag> : <Tag>Nein</Tag>,
                },
            ]}
            dataSource={collectors}
            pagination={false}
        />
    );

    return (
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
            <Title level={3} style={{ margin: 0 }}>Schüler</Title>

            <Space wrap>
                <Input
                    allowClear
                    placeholder="Name (Vor- oder Nachname)"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onPressEnter={onSearch}
                    style={{ width: 260 }}
                    prefix={<SearchOutlined />}
                />
                <Select
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    placeholder="Gruppe"
                    value={groupId}
                    onChange={setGroupId}
                    style={{ width: 200 }}
                    options={groups.map((group) => ({ value: group.id, label: group.name }))}
                />
                <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>Suchen</Button>
                <Tooltip title="Filter & Tabelle zurücksetzen">
                    <Button icon={<ReloadOutlined />} onClick={onReset} />
                </Tooltip>
                {canOnboardStudents && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenAdd(true)}>
                        Schüler hinzufügen
                    </Button>
                )}
            </Space>

            <Table<StudentDTO>
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={rows}
                expandable={{
                    expandedRowRender: (student) => renderCollectors(student.collectors),
                    rowExpandable: (student) => student.collectors.length > 0,
                }}
                pagination={{
                    current: page + 1,
                    pageSize,
                    total,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50, 100],
                    showTotal: (value) => `${value} Schüler`,
                }}
                onChange={onPageChange}
            />

            {canOnboardStudents && (
                <AddStudentModal
                    open={openAdd}
                    groups={groups}
                    onClose={() => setOpenAdd(false)}
                    onCreated={() => void load(page, pageSize)}
                />
            )}
        </Space>
    );
}
