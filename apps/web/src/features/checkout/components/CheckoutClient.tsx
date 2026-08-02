"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {Button, Input, message, Space, Table, Tag, Typography} from "antd";
import type {ColumnsType, TablePaginationConfig} from "antd/es/table";
import {LogoutOutlined, UserOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import type {CheckoutCollectorInfo, CheckoutStudentInfo} from "@kubuci-hort/types";
import {confirmCheckoutWithCollector, confirmSelfDismissal, getPresentStudents} from "../api";
import {HttpError} from "@kubuci-hort/http";

function checkoutError(error: unknown) {
    if (error instanceof HttpError && error.code === "attendance_already_checked_out") return "Der Schüler wurde bereits abgemeldet";
    if (error instanceof HttpError && error.code === "checkout_authorization_not_active") return "Die ausgewählte Berechtigung ist nicht mehr gültig";
    if (error instanceof HttpError && error.code === "attendance_not_checked_in") return "Der Schüler ist heute nicht angemeldet";
    return "Checkout konnte nicht gespeichert werden";
}

export default function CheckoutClient() {
    const [query, setQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");
    const [rows, setRows] = useState<CheckoutStudentInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [total, setTotal] = useState(0);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getPresentStudents(submittedQuery, page, size);
            setRows(result.items); setTotal(result.totalElements);
        } catch (error) { console.error(error); message.error("Anwesende Schüler konnten nicht geladen werden"); }
        finally { setLoading(false); }
    }, [submittedQuery, page, size]);
    useEffect(() => { void load(); }, [load]);

    const remove = (attendanceId: string) => {
        setRows(current => current.filter(row => row.attendanceId !== attendanceId));
        setTotal(current => Math.max(0, current - 1));
    };
    const pickup = async (row: CheckoutStudentInfo, collector: CheckoutCollectorInfo) => {
        try {
            await confirmCheckoutWithCollector(row.attendanceId, collector); remove(row.attendanceId);
            message.success(`${row.student.firstName} ${row.student.lastName} wurde abgemeldet`);
        } catch (error) { console.error(error); message.error(checkoutError(error)); }
    };
    const selfDismiss = async (row: CheckoutStudentInfo) => {
        if (!row.selfDismissalId) return;
        try {
            await confirmSelfDismissal(row.attendanceId, row.selfDismissalId); remove(row.attendanceId);
            message.success(`${row.student.firstName} ${row.student.lastName} wurde abgemeldet`);
        } catch (error) { console.error(error); message.error(checkoutError(error)); }
    };

    const columns: ColumnsType<CheckoutStudentInfo> = useMemo(() => [
        {title: "Schüler", render: (_, row) => <Space orientation="vertical" size={0}>
            <span>{row.student.firstName} {row.student.lastName}</span>
            <Typography.Text type="secondary">{row.student.groupName ?? "—"}</Typography.Text>
        </Space>},
        {title: "Anmeldung", render: (_, row) => dayjs(row.checkedInAt).format("HH:mm")},
        {title: "Allein gehen", render: (_, row) => row.canLeaveAloneNow
            ? <Button size="small" icon={<UserOutlined/>} onClick={() => void selfDismiss(row)}>
                Ab {row.allowedToLeaveFromTime?.slice(0, 5) ?? "jetzt"}
            </Button> : <Tag>Nein</Tag>},
        {title: "Berechtigte Abholer", render: (_, row) => row.allowedCollectors.length === 0
            ? <Typography.Text type="secondary">Keine aktuell gültige Berechtigung</Typography.Text>
            : <Space orientation="vertical">{row.allowedCollectors.map(collector =>
                <Button key={collector.pickupRightId} type="primary" size="small" icon={<LogoutOutlined/>}
                        onClick={() => void pickup(row, collector)}>
                    {collector.firstName} {collector.lastName}{collector.mainCollector ? " (Haupt)" : ""}
                </Button>)}</Space>},
    ], []);

    const onPage = (pagination: TablePaginationConfig) => {
        setPage((pagination.current ?? 1) - 1); setSize(pagination.pageSize ?? 20);
    };
    const search = () => { setPage(0); setSubmittedQuery(query.trim()); };

    return <Space orientation="vertical" size="large" style={{width: "100%"}}>
        <Typography.Title level={3} style={{margin: 0}}>Abmeldung</Typography.Title>
        <Typography.Text type="secondary">Es werden ausschließlich heute angemeldete Schüler angezeigt.</Typography.Text>
        <Space><Input.Search allowClear placeholder="Name oder Gruppe" value={query}
                             onChange={event => setQuery(event.target.value)} onSearch={search}/>
            <Button onClick={() => void load()}>Aktualisieren</Button></Space>
        <Table rowKey="attendanceId" loading={loading} columns={columns} dataSource={rows} onChange={onPage}
               pagination={{current: page + 1, pageSize: size, total, showSizeChanger: true}}/>
    </Space>;
}
