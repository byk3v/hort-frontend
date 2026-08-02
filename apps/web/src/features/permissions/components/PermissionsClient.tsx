"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {Button, message, Popconfirm, Select, Space, Table, Tag, Typography} from "antd";
import type {ColumnsType, TablePaginationConfig} from "antd/es/table";
import dayjs from "dayjs";
import {fetchPermissions, revokePermission} from "../api";
import {PermissionViewDto, StudentAuthorizationStatus} from "@kubuci-hort/types";
import AddPermissionModal from "./AddPermissionModal";

const labels: Record<StudentAuthorizationStatus, string> = {
    ACTIVE: "Aktiv", SCHEDULED: "Geplant", EXPIRED: "Abgelaufen", REVOKED: "Widerrufen",
};
const colors: Record<StudentAuthorizationStatus, string> = {
    ACTIVE: "green", SCHEDULED: "blue", EXPIRED: "default", REVOKED: "red",
};

export default function PermissionsClient() {
    const [status, setStatus] = useState<StudentAuthorizationStatus | "ALL">("ACTIVE");
    const [rows, setRows] = useState<PermissionViewDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [total, setTotal] = useState(0);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const result = await fetchPermissions(status, page, size);
            setRows(result.items); setTotal(result.totalElements);
        } catch (error) { console.error(error); message.error("Fehler beim Laden der Vollmachten"); }
        finally { setLoading(false); }
    }, [status, page, size]);
    useEffect(() => { void load(); }, [load]);

    const columns: ColumnsType<PermissionViewDto> = useMemo(() => [
        {title: "Schüler", render: (_, row) => <Space orientation="vertical" size={0}><span>{row.student.firstName} {row.student.lastName}</span><Typography.Text type="secondary">{row.student.groupName ?? "—"}</Typography.Text></Space>},
        {title: "Berechtigung", render: (_, row) => row.kind === "SELF_DISMISSAL"
            ? <Tag color="purple">Allein gehen</Tag>
            : <span>{row.collector?.firstName} {row.collector?.lastName}</span>},
        {title: "Zeitraum", render: (_, row) => `${dayjs(row.validFrom).format("DD.MM.YYYY HH:mm")} – ${row.validUntil ? dayjs(row.validUntil).format("DD.MM.YYYY HH:mm") : "∞"}`},
        {title: "Status", render: (_, row) => <Tag color={colors[row.status]}>{labels[row.status]}</Tag>},
        {title: "", render: (_, row) => row.status !== "REVOKED" && <Popconfirm title="Vollmacht wirklich widerrufen?" onConfirm={async () => { await revokePermission(row.kind, row.id); await load(); }}><Button danger size="small">Widerrufen</Button></Popconfirm>},
    ], [load]);

    const changePage = (pagination: TablePaginationConfig) => {
        setPage((pagination.current ?? 1) - 1); setSize(pagination.pageSize ?? 20);
    };

    return <Space orientation="vertical" size="large" style={{width: "100%"}}>
        <Typography.Title level={3} style={{margin: 0}}>Vollmachten</Typography.Title>
        <Space>
            <Select value={status} style={{width: 170}} onChange={value => { setStatus(value); setPage(0); }} options={[
                {value: "ACTIVE", label: "Aktiv"}, {value: "SCHEDULED", label: "Geplant"},
                {value: "EXPIRED", label: "Abgelaufen"}, {value: "REVOKED", label: "Widerrufen"}, {value: "ALL", label: "Alle"},
            ]}/>
            <Button type="primary" onClick={() => setOpen(true)}>Neue Vollmacht</Button>
        </Space>
        <Table rowKey={row => `${row.kind}-${row.id}`} loading={loading} columns={columns} dataSource={rows}
               onChange={changePage} pagination={{current: page + 1, pageSize: size, total, showSizeChanger: true}}/>
        <AddPermissionModal open={open} onClose={() => setOpen(false)} onCreated={async () => { setOpen(false); await load(); }}/>
    </Space>;
}
