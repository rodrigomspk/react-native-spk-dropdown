

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    TextInput,
    ScrollView,
    Modal,
    Dimensions,
    StyleSheet,
    FlatList,
} from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const errorColor = "#ff0000";
const lightgrey = "#bdc3c7";
const labelTextInputColor = "#4d4d4d";
const selectedDropDown = "#0066ff";
const defaultItemHeight = 40;
const defaultBoxHeight = 40;

/** 
 * Customized dropdown component
 */
const Dropdown = ({
    data = [],
    selectedItem,
    placeholder,
    onChange = () => { },
    required = false,
    primaryColor = "#0066ff",
    boxStyle,
    boxTextStyle,
    boxIconColor = "#0066ff",
    boxIconZise = 15,
    label = '',
    labelStyle,
    errorMessage = '',
    errorVisibility = false,
    setErrorVisibility = () => { },
    listContainerStyle,
    itemListStyle,
    itemTextStyle,
    listItem,
    itemBoxSelected
}) => {


    const [collapsible, setCollapsible] = useState(false);
    const [yPosition, setYPosition] = useState(0);
    const [dimensions, setDimensions] = useState({ window, screen });
    const [windowsSize, setWindowsSize] = useState();
    const [listItemHeight, setListItemHeight] = useState();
    const [boxHeight, setBoxHeight] = useState();

    //referencia de vista
    const [itemView, setItemView] = useState(null);

    useEffect(() => {
        setListSize();
        setTimeout(() => {
            setListSize();
        }, 2000);
    }, [data, listItemHeight, boxHeight]);

    /**
     * The method allows you to indicate the height that the list will have,
     * hierarchically takes into account "listItemHeight" or "itemListStyle.height" 
     * or "defaultItemHeight" to establish the size of the list.
     */
    function setListSize() {
        if (data) {
            let size = (data).length
            currentItemSize = (listItemHeight && listItem) ? listItemHeight : (itemListStyle?.height) ? Number(itemListStyle.height) : defaultItemHeight;
            var currentSize = currentItemSize * size;
            var maxSize = Number(dimensions.window.height) * 0.5;

            while (currentSize > maxSize) {
                currentSize = currentSize - currentItemSize;
            }

            setWindowsSize(currentSize);
        }
    }

    /**
     * Receives the view's props object
     * obtains "height" the height parameter
     * and assigns it to the listItemHeight variable
     * @param {object} layout view props
     */
    const setItemListDimensions = (layout) => {
        const { x, y, width, height } = layout;
        var itemHeight = Math.ceil(height);
        setListItemHeight(Number(itemHeight));
    }

    /**
     * Receives the view's props object
     * obtains "height" the height parameter
     * and assigns it to the boxHeight variable
     * @param {object} layout view props
     */
    const setBoxDimensions = (layout) => {
        const { x, y, width, height } = layout;
        var itemHeight = Math.ceil(height);

        setBoxHeight(Number(itemHeight));
        setBoxHeight(Number(itemHeight));
    }

    return (
        (data)
            ?
            <View style={{ width: '100%', alignItems: 'center' }}>
                <View onTouchStart={(e) => {
                    if (collapsible == false) {
                        /* Calculate the display position of the list */
                        let position = Math.round(e.nativeEvent.pageY);

                        var margin = (boxHeight) ? Number(boxHeight) / 2 : (boxTextStyle?.height) ? Number(boxTextStyle.height) : Number(defaultBoxHeight) / 2;

                        let below = position + margin + windowsSize; //abajo
                        let above = position - margin - windowsSize; //arriba

                        if (below > dimensions.window.height) {
                            setYPosition(above);
                            if (above < 0) {
                                setYPosition(0);
                            } else {
                                setYPosition(above)
                            }
                        } else {
                            setYPosition(position + margin)
                        }

                    }
                }}
                    style={{ width: '100%' }}>

                    {/* Render the element selection box */}
                    {(itemBoxSelected && selectedItem)
                        ?
                        <View style={
                            (boxStyle)
                                ?
                                (boxHeight)
                                    ?
                                    [styles.defaultBoxStyle, { ...boxStyle }, { height: boxHeight }]
                                    :
                                    [{ height: defaultBoxHeight }, styles.defaultBoxStyle, { ...boxStyle }]
                                :
                                (boxHeight)
                                    ?
                                    [styles.defaultBoxStyle, { height: boxHeight }]
                                    :
                                    [{ height: defaultBoxHeight }, styles.defaultBoxStyle]
                        }>
                            <View style={{ flex: 1 }}>
                                {(selectedItem)
                                    ?
                                    <View onLayout={(event) => { setBoxDimensions(event.nativeEvent.layout) }}>
                                        {itemBoxSelected(selectedItem)}
                                    </View>
                                    :
                                    <View>
                                        <TextInput
                                            multiline={false}
                                            selection={{ start: 0 }}
                                            placeholderTextColor={selectedDropDown}
                                            placeholder={(placeholder) ? placeholder : ''}
                                            editable={false}
                                            value={''}
                                            style={(boxTextStyle) ? [styles.defaultBoxTextStyle, { ...boxTextStyle }] : [styles.defaultBoxTextStyle]}
                                        />
                                    </View>
                                }
                            </View>
                            <TouchableOpacity
                                style={{ width: 30, justifyContent: "center", alignItems: "center" }}
                                onPress={() => {
                                    setCollapsible(!collapsible);
                                }}
                            >
                                <Icon
                                    name={"chevron-down"}
                                    size={boxIconZise}
                                    color={boxIconColor}
                                />
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={
                            (boxStyle)
                                ?
                                [styles.defaultBoxStyle, { height: defaultBoxHeight }, { ...boxStyle }]
                                :
                                [styles.defaultBoxStyle, { height: defaultBoxHeight }]
                        }>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    multiline={false}
                                    selection={{ start: 0 }}
                                    placeholderTextColor={selectedDropDown}
                                    placeholder={(placeholder) ? placeholder : ''}
                                    editable={false}
                                    value={(selectedItem?.label) ? selectedItem.label : ''}
                                    style={(boxTextStyle) ? (selectedItem?.label) ? [styles.defaultBoxTextStyle, { ...boxTextStyle }] : [styles.defaultBoxTextStyle, { ...boxTextStyle }, { color: primaryColor }] : (selectedItem?.label) ? [styles.defaultBoxTextStyle, { color: primaryColor }] : [styles.defaultBoxTextStyle]}
                                />
                            </View>
                            <TouchableOpacity
                                style={{ width: 30, justifyContent: "center", alignItems: "center" }}
                                onPress={() => {
                                    setCollapsible(!collapsible);
                                }}
                            >
                                <Icon
                                    name={"chevron-down"}
                                    size={boxIconZise}
                                    color={boxIconColor}
                                />
                            </TouchableOpacity>
                        </View>
                    }


                    {/* Renders the label and error message*/}
                    {(label)
                        &&
                        (required)
                        ?
                        <View style={{ alignItems: 'flex-start', width: '100%', flexDirection: "row" }}>
                            <Text style={
                                (labelStyle)
                                    ?
                                    [{ ...labelStyle }, {
                                        color: (errorVisibility)
                                            ? errorColor
                                            : (labelStyle?.color)
                                                ? labelStyle.color
                                                : labelTextInputColor
                                    }]
                                    :
                                    [styles.defaultLabelStyle, {
                                        color: (errorVisibility)
                                            ? errorColor
                                            : labelTextInputColor
                                    }]}>* {label} </Text>

                            {(errorVisibility)
                                ?
                                <Text style={(labelStyle)
                                    ? [{ ...labelStyle }, { color: errorColor }]
                                    : [styles.defaultLabelStyle, { color: errorColor }]}>{(errorMessage) ? "(" + errorMessage + ")" : ''}</Text>
                                :
                                null
                            }
                        </View>
                        :
                        <View style={{ alignItems: 'flex-start', width: '100%', flexDirection: "row" }}>
                            <Text style={(labelStyle)
                                ?
                                [{ ...labelStyle }, {
                                    color: (required)
                                        ? (errorVisibility)
                                            ? errorColor
                                            : (labelStyle?.color)
                                                ? labelStyle.color
                                                : labelTextInputColor
                                        : (labelStyle?.color)
                                            ? labelStyle.color
                                            : labelTextInputColor
                                }]
                                :
                                [styles.defaultLabelStyle, {
                                    color: (required)
                                        ? (errorVisibility)
                                            ? errorColor
                                            : (labelStyle?.color)
                                                ? labelStyle.color
                                                : labelTextInputColor
                                        : (labelStyle?.color)
                                            ? labelStyle.color
                                            : labelTextInputColor
                                }]}>{label}</Text>
                        </View>
                    }

                    {/* List of elements */}
                    {(collapsible)
                        ?
                        <Modal
                            visible={collapsible}
                            animationType='fade'
                            transparent={true}
                            style={{
                                height: "100%",
                                width: "100%",
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => { setCollapsible(false) }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',
                                    paddingTop: yPosition,
                                    paddingHorizontal: 10
                                }}>

                                {(data.length > 0)
                                    &&
                                    <View style={(listContainerStyle) ? [styles.defaultListContainerStyle, { ...listContainerStyle }, { height: windowsSize }] : [styles.defaultListContainerStyle, { height: windowsSize }]}>
                                        {(listItem)
                                            ?
                                            < FlatList
                                                style={{ flex: 1, width: '100%' }}
                                                showsVerticalScrollIndicator={false}
                                                data={data}
                                                keyExtractor={(item) => (item.value).toString()}
                                                renderItem={(item) =>
                                                    <View>
                                                        <TouchableOpacity onPress={() => {
                                                            onChange(item.item);
                                                            setErrorVisibility(false);
                                                            setCollapsible(false)
                                                        }}
                                                            style={{ width: '100%' }}
                                                        >
                                                            <View style={(itemListStyle) ? [styles.defaultItemStyle, { ...itemListStyle }] : styles.defaultItemStyle}>

                                                                <View
                                                                    ref={(itemView) => { setItemView(itemView) }}
                                                                    onLayout={(event) => { setItemListDimensions(event.nativeEvent.layout) }} style={{ flex: 1 }}>
                                                                    {listItem(item)}
                                                                </View>

                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                }
                                            />
                                            :
                                            <ScrollView
                                                vertical
                                                showsVerticalScrollIndicator={false}
                                                nestedScrollEnabled={true}
                                                style={{ width: '100%', height: '100%' }}
                                            >
                                                {(data).map((item) => {
                                                    return (
                                                        <View key={item.value}>
                                                            <TouchableOpacity onPress={() => {
                                                                onChange(item);
                                                                setErrorVisibility(false);
                                                                setCollapsible(false)
                                                            }}
                                                                style={{ width: '100%' }}
                                                            >
                                                                <View style={(itemListStyle) ? [styles.defaultItemStyle, { height: defaultItemHeight }, { ...itemListStyle }] : [styles.defaultItemStyle, { height: defaultItemHeight }]}>

                                                                    <View style={{ justifyContent: "center", flex: 1 }}>
                                                                        <Text style={(itemTextStyle) ? [{ ...itemTextStyle }, { color: (selectedItem?.value == item.value) ? primaryColor : ((itemTextStyle?.color) ? itemTextStyle.color : "#000") }, styles.defaultItemTextStyle] : [{ color: (selectedItem?.value == item.value) ? primaryColor : "#000" }, styles.defaultItemTextStyle]}>{item.label}</Text>
                                                                    </View>

                                                                    {(selectedItem?.value == item.value) &&
                                                                        <View style={{ width: boxIconZise + 10, backgroundColor: "transparent" }}>
                                                                            <Icon
                                                                                name={"check"}
                                                                                size={boxIconZise}
                                                                                color={primaryColor}
                                                                            />
                                                                        </View>
                                                                    }

                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                })}
                                            </ScrollView>
                                        }

                                    </View>
                                }
                            </TouchableOpacity>
                        </Modal>
                        :
                        null
                    }

                </View >
            </View >
            :
            null
    )

};

const styles = StyleSheet.create({
    defaultBoxStyle: {
        backgroundColor: "#fff",
        borderWidth: 0.5,
        flexDirection: "row",
        borderRadius: 5,
        alignItems: 'center',
        borderColor: lightgrey
    },
    defaultBoxTextStyle: {
        paddingHorizontal: 10,
        fontSize: 17,
        color: "#0066ff"
    },
    defaultLabelStyle: {
        fontSize: 12
    },
    defaultItemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#fff",
        borderTopWidth: 0,
        backgroundColor: '#fff',
        borderTopWidth: 0.5,
        borderColor: lightgrey
    },
    defaultItemTextStyle: {
        fontSize: 17,
        paddingHorizontal: 10
    },
    defaultListContainerStyle: {
        backgroundColor: '#fff',
        borderColor: lightgrey,
        borderWidth: 0.5,
        borderRadius: 5,
        width: '100%',
        overflow: 'hidden'
    }
});

export default Dropdown;